use std::collections::{HashMap, HashSet, VecDeque};
use serenity::model::id::{UserId, GuildId, MessageId};
use serenity::prelude::Context;
use lazy_static::lazy_static;
use std::sync::Mutex;
use scraper::{Html, Selector};
use serde_json::{Value};
use riven::consts::PlatformRoute::NA1;
use riven::consts::{QueueType,Tier,Division, Queue};
use riven::RiotApi;
use itertools::iproduct;
use crate::lib::openskill::lib::{Rating,DEFAULT_SIGMA};
use crate::lib::database::{save_player,get_players,next_game_id};
use crate::{DBCONNECTION, LOADING_EMOJI};

use super::openskill::lib::predicte_win;

use tracing::log::info;

lazy_static! {
    pub static ref TOP_EMOJI: Mutex<String> = Mutex::new(String::from(":frog: "));
    pub static ref JG_EMOJI: Mutex<String> = Mutex::new(String::from(":dog: "));
    pub static ref MID_EMOJI: Mutex<String> = Mutex::new(String::from(":cat: "));
    pub static ref BOT_EMOJI: Mutex<String> = Mutex::new(String::from(":blue_car: "));
    pub static ref SUP_EMOJI: Mutex<String> = Mutex::new(String::from(":police_car: "));
}

static RANKPOINTTABLE: [(&str,i8);27] = [
    ("CHALLENGER 1",45),
    ("GRANDMASTER 1",42),
    ("MASTER 1",40),
    ("DIAMOND 1",36),
    ("DIAMOND 2",34),
    ("DIAMOND 3",31),
    ("DIAMOND 4",29),
    ("PLATINUM 1",27),
    ("PLATINUM 2",26),
    ("PLATINUM 3",23),
    ("PLATINUM 4",21),
    ("GOLD 1",20),
    ("GOLD 2",19),
    ("GOLD 3",18),
    ("GOLD 4",17),
    ("SILVER 1",16),
    ("SILVER 2",16),
    ("SILVER 3",15),
    ("SILVER 4",15),
    ("BRONZE 1",15),
    ("BRONZE 2",15),
    ("BRONZE 3",15),
    ("BRONZE 4",15),
    ("IRON 1",15),
    ("IRON 2",15),
    ("IRON 3",15),
    ("IRON 4",15),
];

pub struct QueueManager{
    top: VecDeque<UserId>, // discord_id
    jungle: VecDeque<UserId>,
    mid: VecDeque<UserId>,
    bot: VecDeque<UserId>,
    support: VecDeque<UserId>,
    players: HashMap<UserId,Player>, //key: discord id, value: Player
    current_games: Vec<Game>,
    pub tentative_games: Vec<Game>,
}

#[derive(Debug, Clone)]
pub struct Player{
    pub riot_accounts: Vec<String>, // list of puuids for each account 
    pub queued: Vec<String>,
    pub rating: Rating,
}

#[derive(Clone)]
pub struct Game {
    id: i32,
    pub displayed: bool,
    pub message_id: MessageId,
    pub expected_winrate: f64,
    top: [UserId;2],
    jungle: [UserId;2],
    mid: [UserId;2],
    bot: [UserId;2],
    support: [UserId;2],
}

impl Game {
    fn new(queue: &QueueManager, expected_winrate: f64) -> Game {
        Game {
            id: {
                if queue.tentative_games.len() == 0{
                    if queue.current_games.len() == 0{
                        let conn = DBCONNECTION.db_connection.get().unwrap();
                        next_game_id(&conn)
                    } else {
                        queue.current_games.last().unwrap().id +1
                    }
                } else {
                    queue.tentative_games.last().unwrap().id +1
                }
            },
            expected_winrate,
            displayed: false,
            message_id: MessageId(0),
            top: [UserId(0);2],
            jungle: [UserId(0);2],
            mid: [UserId(0);2],
            bot: [UserId(0);2],
            support: [UserId(0);2],
        }
    }
    fn from(queue: &QueueManager,teams: Vec<Vec<&UserId>>, blue_winrate: f64) -> Game {
        let mut game = Game::new(queue, blue_winrate);
        for (i,team) in teams.iter().enumerate() {
            for (j,player) in team.iter().enumerate() {
                match j {
                    0 => game.top[i] = *player.clone(),
                    1 => game.jungle[i] = *player.clone(),
                    2 => game.mid[i] = *player.clone(),
                    3 => game.bot[i] = *player.clone(),
                    4 => game.support[i] = *player.clone(),
                    _ => panic!("Too many players in a team"),
                }
            }
        }
        game
    }

    pub async fn display(&self, ctx: &Context, guild_id: GuildId) -> (String,String){
        let teams = vec![[self.top[0],self.jungle[0],self.mid[0],self.bot[0],self.support[0]],[self.top[1],self.jungle[1],self.mid[1],self.bot[1],self.support[1]]];
        let mut return_string = Vec::new();
        for team in teams {
            let mut tmp = String::new();
            for (i,player) in team.iter().enumerate() {
                let name;
                if player == &0 || player == &1 || player == &2 || player == &3 || player == &4 || player == &5 || player == &6 || player == &7 || player == &8 || player == &9 {
                    name = format!("Unknown {}" ,player);
                } else {
                    name = player.to_user(&ctx.http).await.unwrap().name;
                }
                // let username = player.to_user(&ctx.http).await.unwrap().name;
                // name = player.to_user(&ctx.http).await.unwrap().nick_in(&ctx.http, guild_id).await.unwrap_or_else(|| username);
                match i {
                    0 => tmp.push_str(&TOP_EMOJI.lock().unwrap()),
                    1 => tmp.push_str(&JG_EMOJI.lock().unwrap()),
                    2 => tmp.push_str(&MID_EMOJI.lock().unwrap()),
                    3 => tmp.push_str(&BOT_EMOJI.lock().unwrap()),
                    4 => tmp.push_str(&SUP_EMOJI.lock().unwrap()),
                    _ => panic!("Too many players in a team"),
                };
                tmp.push_str(&LOADING_EMOJI);
                tmp.push_str(&name); 
                tmp.push_str("\n");
            }
            return_string.push(tmp);
        }
        (return_string[0].clone(),return_string[1].clone())
    }
}

impl QueueManager{
    pub fn new() -> QueueManager{
        let mut queue = QueueManager{
            top: VecDeque::new(),
            jungle: VecDeque::new(),
            mid: VecDeque::new(),
            bot: VecDeque::new(),
            support: VecDeque::new(),
            players: HashMap::new(),
            current_games: Vec::new(),
            tentative_games: Vec::new(),
        };
        let conn = DBCONNECTION.db_connection.get().unwrap();
        let result = get_players(&conn);
        for player in result{
            queue.players.insert(player.0,player.1);
        }
        queue
    }

    pub fn check_registered_player(&self, discord_id: UserId) -> Result<(), &str>{
        if self.players.contains_key(&discord_id){
            return Err("Player already registered");
        }
        Ok(())
    }

    pub fn check_puuid(&self, puuid: &str) -> Result<(),()>{
        for player in self.players.values(){
            if player.riot_accounts.contains(&puuid.to_string()){
                return Err(());
            }
        }
        Ok(())
    }

    pub fn register_player(&mut self, discord_id: UserId, accounts: Vec<String>,msl_sigma_value: f64){
        let player = Player{
            riot_accounts: accounts,
            queued: Vec::new(),
            rating: Rating::from(discord_id,msl_sigma_value,DEFAULT_SIGMA*(1.0+(msl_sigma_value/100.0))),
        };
        // {
        //     let conn = DBCONNECTION.db_connection.get().unwrap();
        //     save_player(&conn,&discord_id,&player);
        // }
        self.players.insert(discord_id, player);
    }

    pub fn queue_player(&mut self, discord_id: UserId, role: &str) -> Result<(), &str> {
        if !self.players.contains_key(&discord_id){
            return Err("Player not registered");
        }
        if let Some(p) = self.players.get_mut(&discord_id) {
            if p.queued.contains(&role.to_string()) {
                return Err("Player is already in queue for this role");
            }
            if p.queued.len() >= 2 {
                return Err("Player is already in queue for two roles");
            }
            let role = role.to_lowercase();
            //Add more aliases for roles 
            match role.as_str() {
                "top" => {
                    p.queued.push(role.clone()); 
                    self.top.push_back(discord_id);
                },
                "jungle" | "jung" | "jg" | "jng" => {
                    p.queued.push(role.clone());
                    self.jungle.push_back(discord_id);
                },
                "mid" => {
                    p.queued.push(role.clone());
                    self.mid.push_back(discord_id);
                },
                "bot" | "adc" => {
                    p.queued.push(role.clone());
                    self.bot.push_back(discord_id);
                },
                "support" | "sup" => {
                    p.queued.push(role.clone());
                    self.support.push_back(discord_id);
                },
                _ => return Err("Invalid role")
            }
        } else {
            return Err("Player is not registered");
        }
        Ok(())
    }

    //TODO correct some logic with storing player queue in two locations, might be better to just store it in one but check it profiler just incase
    pub fn leave_queue(&mut self, discord_id: UserId, role: &str) -> Result<(), &str> {
        let role = role.to_lowercase();
        let discord_id = &discord_id;
        if let Some(player) = self.players.get_mut(discord_id) {
            match role.as_str(){
                "top" => {
                    self.top.retain(|player| player != discord_id);
                    player.queued.retain(|role| role != "top");
                },
                "jungle" => {
                    self.jungle.retain(|player| player != discord_id);
                    player.queued.retain(|role| role != "jungle");
                },
                "mid" => {
                    self.mid.retain(|player| player != discord_id);
                    player.queued.retain(|role| role != "mid");
                },
                "bot" => {
                    self.bot.retain(|player| player != discord_id);
                    player.queued.retain(|role| role != "bot");
                },
                "support" => {
                    self.support.retain(|player| player != discord_id);
                    player.queued.retain(|role| role != "support");
                },
                _ => {
                    self.top.retain(|player| player != discord_id);
                    self.jungle.retain(|player| player != discord_id);
                    self.mid.retain(|player| player != discord_id);
                    self.bot.retain(|player| player != discord_id);
                    self.support.retain(|player| player != discord_id);
                    player.queued.retain(|role| role != role);
                }
            }
        }
        Ok(())
    }

    pub async fn number_of_unique_players(&self) -> usize{
        let mut unique_players = HashSet::new();
        for player in &self.top {
            unique_players.insert(player);
        }
        for player in &self.jungle {
            unique_players.insert(player);
        }
        for player in &self.mid {
            unique_players.insert(player);
        }
        for player in &self.bot {
            unique_players.insert(player);
        }
        for player in &self.support {
            unique_players.insert(player);
        }
        unique_players.len()
    }

    pub async fn check_for_game(&mut self) -> Option<String>{
        if self.top.len() >= 2 && self.jungle.len() >= 2 && self.mid.len() >= 2 && self.bot.len() >= 2 && self.support.len() >= 2 {
            info!("Starting game");
            //TODO this needs a lot of work, no O(n^2)
            let mut final_team: Vec<Vec<&UserId>> = Vec::new();

            let mut tmp_top: VecDeque<UserId> = VecDeque::new();
            let mut tmp_jungle: VecDeque<UserId> = VecDeque::new();
            let mut tmp_mid: VecDeque<UserId> = VecDeque::new();
            let mut tmp_bot: VecDeque<UserId> = VecDeque::new();
            let mut tmp_support: VecDeque<UserId> = VecDeque::new();
            tmp_top.push_back(self.top.pop_front().unwrap());
            tmp_top.push_back(self.top.pop_front().unwrap());
            tmp_jungle.push_back(self.jungle.pop_front().unwrap());
            tmp_jungle.push_back(self.jungle.pop_front().unwrap());
            tmp_mid.push_back(self.mid.pop_front().unwrap());
            tmp_mid.push_back(self.mid.pop_front().unwrap());
            tmp_bot.push_back(self.bot.pop_front().unwrap());
            tmp_bot.push_back(self.bot.pop_front().unwrap());
            tmp_support.push_back(self.support.pop_front().unwrap());
            tmp_support.push_back(self.support.pop_front().unwrap());

            let mut team1_winrate = 0.0;
            'outer: for (top, jng, mid, bot ,sup) in iproduct!(tmp_top.iter(), tmp_jungle.iter(), tmp_mid.iter(), tmp_bot.iter(), tmp_support.iter()) {
                for (top2, jng2, mid2, bot2, sup2) in iproduct!(tmp_top.iter(), tmp_jungle.iter(), tmp_mid.iter(), tmp_bot.iter(), tmp_support.iter()) {
                    /*
                        Given a two lists of players, check that there are no duplicates in the lists.
                     */
                    //TODO this is a bit of a hack, but it works for now
                    if top == top2 || top == jng2 || top == mid2 || top == bot2 || top == sup2 || jng == top2 || jng == jng2 || jng == mid2 || jng == bot2 || jng == sup2 || mid == top2 || mid == jng2 || mid == mid2 || mid == bot2 || mid == sup2 || bot == top2 || bot == jng2 || bot == mid2 || bot == bot2 || bot == sup2 || sup == top2 || sup == jng2 || sup == mid2 || sup == bot2 || sup == sup2 || top == jng || top == mid|| top == bot || top == sup || jng == mid || jng == bot || jng == sup || mid == bot || mid == sup || bot == sup {
                        continue 'outer;
                    }

                    let team1 = vec![self.players.get(top).unwrap().rating.clone(), self.players.get(jng).unwrap().rating.clone(), self.players.get(mid).unwrap().rating.clone(), self.players.get(bot).unwrap().rating.clone(), self.players.get(sup).unwrap().rating.clone()];
                    let team2 = vec![self.players.get(top2).unwrap().rating.clone(), self.players.get(jng2).unwrap().rating.clone(), self.players.get(mid2).unwrap().rating.clone(), self.players.get(bot2).unwrap().rating.clone(), self.players.get(sup2).unwrap().rating.clone()];
                    let teams = vec![team1, team2];
                    team1_winrate = predicte_win(&teams);
                    if team1_winrate > 0.45 && team1_winrate < 0.55 {
                        let team1 = vec![top, jng, mid, bot, sup];
                        let team2 = vec![top2, jng2, mid2, bot2, sup2];
                        final_team = vec![team1, team2];
                        break 'outer;
                    }
                }
            }
            //assuming valid game was found
            //TODO Logic incase no game is found
            let game = Game::from(self,final_team, team1_winrate);
            self.tentative_games.push(game);
        } else {
            let mut missing_roles = Vec::new();
            if self.top.len() < 2 {
                missing_roles.push("Top");
            }
            if self.jungle.len() < 2 {
                missing_roles.push("Jungle");
            }
            if self.mid.len() < 2 {
                missing_roles.push("Mid");
            }
            if self.bot.len() < 2 {
                missing_roles.push("Bot");
            }
            if self.support.len() < 2 {
                missing_roles.push("Support");
            }
            if missing_roles.len() > 0 {
                return Some(format!("{}", missing_roles.join(", ")));
            }
        }
        None
    }

    pub async fn display(&self, ctx: &Context, guild_id: GuildId) -> String{
        let mut output = String::new();
        output.push_str(&TOP_EMOJI.lock().unwrap());
        for player in self.top.iter(){
            let name: String;
            // if player == &0 || player == &1 || player == &2 || player == &3 || player == &4 || player == &5 || player == &6 || player == &7 || player == &8 || player == &9 {
            //     name = format!("Unknown {}" ,player);
            // } else {
            //     name = player.to_user(&ctx.http).await.unwrap().name;
            // }
            let username = player.to_user(&ctx.http).await.unwrap().name;
            name = player.to_user(&ctx.http).await.unwrap().nick_in(&ctx.http, guild_id).await.unwrap_or_else(|| username);
            output.push_str(&name);
            output.push_str(" ");
        }
        output.push_str("\n");

        output.push_str(&JG_EMOJI.lock().unwrap());
        for player in self.jungle.iter(){
            let name;
            // if player == &0 || player == &1 || player == &2 || player == &3 || player == &4 || player == &5 || player == &6 || player == &7 || player == &8 || player == &9 {
            //     name = format!("Unknown {}" ,player);
            // } else {
            //     name = player.to_user(&ctx.http).await.unwrap().name;
            // }
            let username = player.to_user(&ctx.http).await.unwrap().name;
            name = player.to_user(&ctx.http).await.unwrap().nick_in(&ctx.http, guild_id).await.unwrap_or_else(|| username);
            output.push_str(&name);
            output.push_str(" ");
        }
        output.push_str("\n");

        output.push_str(&MID_EMOJI.lock().unwrap());
        for player in self.mid.iter(){
            let name;
            // if player == &0 || player == &1 || player == &2 || player == &3 || player == &4 || player == &5 || player == &6 || player == &7 || player == &8 || player == &9 {
            //     name = format!("Unknown {}" ,player);
            // } else {
            //     name = player.to_user(&ctx.http).await.unwrap().name;
            // }
            let username = player.to_user(&ctx.http).await.unwrap().name;
            name = player.to_user(&ctx.http).await.unwrap().nick_in(&ctx.http, guild_id).await.unwrap_or_else(|| username);
            output.push_str(&name);
            output.push_str(" ");
        }
        output.push_str("\n");

        output.push_str(&BOT_EMOJI.lock().unwrap());
        for player in self.bot.iter(){
            let name;
            // if player == &0 || player == &1 || player == &2 || player == &3 || player == &4 || player == &5 || player == &6 || player == &7 || player == &8 || player == &9 {
            //     name = format!("Unknown {}" ,player);
            // } else {
            //     name = player.to_user(&ctx.http).await.unwrap().name;
            // }
            let username = player.to_user(&ctx.http).await.unwrap().name;
            name = player.to_user(&ctx.http).await.unwrap().nick_in(&ctx.http, guild_id).await.unwrap_or_else(|| username);
            output.push_str(&name);
            output.push_str(" ");
        }
        output.push_str("\n");

        output.push_str(&SUP_EMOJI.lock().unwrap());
        for player in self.support.iter(){
            let name;
            // if player == &0 || player == &1 || player == &2 || player == &3 || player == &4 || player == &5 || player == &6 || player == &7 || player == &8 || player == &9 {
            //     name = format!("Unknown {}" ,player);
            // } else {
            //     name = player.to_user(&ctx.http).await.unwrap().name;
            // }
            let username = player.to_user(&ctx.http).await.unwrap().name;
            name = player.to_user(&ctx.http).await.unwrap().nick_in(&ctx.http, guild_id).await.unwrap_or_else(|| username);
            output.push_str(&name);
            output.push_str(" ");
        }
        output.push_str("\n");
        output
    }
}

#[derive(PartialEq,Debug)]
struct Rank {
    tier: String,
    division: String,
    lp: String,
    error: bool,
}

impl Rank {
    fn new() -> Rank {
        Rank {
            tier: String::new(),
            division: String::new(),
            lp: String::new(),
            error: false,
        }
    }
}

#[derive(PartialEq, Debug)]
struct AccountInfo {
    name: String,
    account_level: i32,
    rank2021: Rank,
    rank2020: Rank,
    current_rank: String,
    current_rank_lp: String,
    number_of_games: String,
    winrate: String,
}

impl AccountInfo {
    fn new() -> AccountInfo {
        AccountInfo {
            name: String::new(),
            account_level: 0,
            rank2021: Rank::new(),
            rank2020: Rank::new(),
            current_rank: String::new(),
            current_rank_lp: String::new(),
            number_of_games: String::new(),
            winrate: String::new(),
        }
    }
}

//TODO remove boilerplate code and generally clean up code and make it more readable. Also try to remove some of the magic numbers
pub async fn get_msl_points(opggs: Vec<(String,String,i32)>, riot_key: &str) -> Result<f64, &'static str> {
    let mut accounts: Vec<AccountInfo> = Vec::new();
    for (opgg,id,level) in opggs {
        let mut rank2021 = Rank{
            tier: String::new(),
            division: String::new(),
            lp: String::new(),
            error: false,
        };
        let mut rank2020 = Rank{
            tier: String::new(),
            division: String::new(),
            lp: String::new(),
            error: false,
        };
        if let Ok(response) = reqwest::get(&format!("https://na.op.gg/summoners/na/{}", opgg)).await {
            let doc = Html::parse_document(&response.text().await.unwrap());
            let content = doc.select(&Selector::parse("#__NEXT_DATA__").unwrap()).next().unwrap();
            let json: Value = serde_json::from_str(&content.inner_html()).unwrap();
            let mut lastseason = false;
            if let Some(season) = json["props"]["pageProps"]["data"]["previous_seasons"][0]["season_id"].as_i64() {
                if season == 17 {
                    lastseason = true
                }
            } else {
                lastseason = false;
            }
            let mut lastseason2 = false;
            if let Some(season) = json["props"]["pageProps"]["data"]["previous_seasons"][1]["season_id"].as_i64() {
                if season == 15 {
                    lastseason2 = true;
                }
            } else {
                lastseason2 = false;
            }
            if lastseason {
                if let Some(rank) = json["props"]["pageProps"]["data"]["previous_seasons"][0]["tier_info"]["tier"].as_str() {
                    rank2021.tier = rank.to_string();
                } else {
                    rank2021.error = true;
                }
                if let Some(division) = json["props"]["pageProps"]["data"]["previous_seasons"][0]["tier_info"]["division"].as_i64() {
                    rank2021.division = division.to_string();
                } else {
                    rank2021.error = true;
                }
                let test = &json["props"]["pageProps"]["data"]["previous_seasons"][0]["tier_info"]["lp"];
                if test.is_i64() {
                    rank2021.lp = test.as_i64().unwrap().to_string();
                } else if test.is_null() {
                    rank2021.lp = 0.to_string();
                } else {
                    rank2021.lp = "N/A".to_string();
                }
            } else {
                rank2021.error = true;
            }
            if lastseason2 {
                if let Some(rank) = json["props"]["pageProps"]["data"]["previous_seasons"][1]["tier_info"]["tier"].as_str() {
                    rank2020.tier = rank.to_string();
                } else {
                    rank2020.error = true;
                }
                if let Some(division) = json["props"]["pageProps"]["data"]["previous_seasons"][1]["tier_info"]["division"].as_i64() {
                    rank2020.division = division.to_string();
                } else {
                    rank2020.error = true;
                }
                let test = &json["props"]["pageProps"]["data"]["previous_seasons"][1]["tier_info"]["lp"];
                if test.is_i64() {
                    rank2020.lp = test.as_i64().unwrap().to_string();
                } else if test.is_null(){
                    rank2020.lp = 0.to_string();
                } else {
                    rank2020.lp = "N/A".to_string();
                }
            } else {
                rank2020.error = true;
            }
            
        } else {
            return Err("Failed to get response from op.gg, report this to an admin");
        }
        let riot_api = RiotApi::new(riot_key);
        let ranked_info = riot_api
            .league_v4()
            .get_league_entries_for_summoner(NA1, &id)
            .await
            .unwrap();
        let mut winrate = String::new();
        let mut number_of_games = String::new();
        let mut current_rank = String::new();
        let mut current_rank_lp = String::new();
        for entry in ranked_info {
            if entry.queue_type == QueueType::RANKED_SOLO_5x5 {
                winrate = format!("{}%", (entry.wins as f32 / (entry.wins + entry.losses) as f32 * 100.0) as i64);
                number_of_games = format!("{}", entry.wins + entry.losses);
                current_rank_lp = entry.league_points.to_string();
                let mut tier = String::new();
                match entry.tier.unwrap() {
                    Tier::BRONZE => tier = "Bronze".to_string(),
                    Tier::SILVER => tier = "Silver".to_string(),
                    Tier::GOLD => tier = "Gold".to_string(),
                    Tier::PLATINUM => tier = "Platinum".to_string(),
                    Tier::DIAMOND => tier = "Diamond".to_string(),
                    Tier::MASTER => tier = "Master".to_string(),
                    Tier::GRANDMASTER => tier = "Grandmaster".to_string(),
                    Tier::CHALLENGER => tier = "Challenger".to_string(),
                    Tier::UNRANKED => tier = "N/A".to_string(),
                    _ => current_rank = "N/A".to_string(),
                }
                let mut division = String::new();
                match entry.rank.unwrap() {
                    Division::I => division = "1".to_string(),
                    Division::II => division = "2".to_string(),
                    Division::III => division = "3".to_string(),
                    Division::IV => division = "4".to_string(),
                    _ => current_rank = "N/A".to_string(),
                }
                if current_rank != "N/A" {
                    current_rank = format!("{} {}", tier.to_uppercase(), division);
                }
                break;
            }
        }
        let account = AccountInfo{
            name: opgg,
            account_level: level,
            current_rank,
            current_rank_lp,
            winrate,
            number_of_games,
            rank2021,
            rank2020,
        };
        accounts.push(account);
    }
    let a: f32 = 4.0/57600.0;
    let b: f32 = a * -600.0;
    let c: f32 = a * 90000.0;
    let mut account_level_max = 100;
    let mut s2020_max = 0;
    let mut s2021_max = 0;
    let mut current_rank_max = 0;
    let mut games_max_account = AccountInfo::new();
    let mut current_rank_points = 0;
    let mut ranked_points = 0;
    let mut lp_points;
    let mut ranked_point_index = 0;
    for account in accounts {
        dbg!("{:?}",&account);
        if account.account_level > account_level_max {
            account_level_max = account.account_level;
        }
        if !account.rank2020.error {
            lp_points = account.rank2020.lp.parse::<i32>().unwrap() / 100;
            let rank = &format!("{} {}",account.rank2020.tier.to_uppercase(),account.rank2020.division);
            for i in 0..RANKPOINTTABLE.len(){
                if RANKPOINTTABLE[i].0 == rank {
                    ranked_points = RANKPOINTTABLE[i].1 as i32;
                    ranked_point_index = i;
                    break;
                }
            }
            if ranked_point_index == 0 {
                ranked_point_index = 1;
            }
            lp_points = lp_points * (RANKPOINTTABLE[ranked_point_index-1].1 as i32 - ranked_points);
            if ranked_points < 40 {
                ranked_points = ranked_points + lp_points;
            }
            if ranked_points > s2020_max {
                s2020_max = ranked_points;
            }
        }
        if !account.rank2021.error {
            lp_points = account.rank2021.lp.parse::<i32>().unwrap() / 100;
            let rank = &format!("{} {}",account.rank2021.tier.to_uppercase(),account.rank2021.division);
            for i in 0..RANKPOINTTABLE.len(){
                if RANKPOINTTABLE[i].0 == rank {
                    ranked_points = RANKPOINTTABLE[i].1 as i32;
                    ranked_point_index = i;
                    break;
                }
            }
            if rank == "CHALLENGER 1" {
                ranked_point_index = 1;
            }
            lp_points = lp_points * (RANKPOINTTABLE[ranked_point_index-1].1 as i32 - ranked_points);
            if ranked_points < 40 {
                ranked_points = ranked_points + lp_points;
            }
            if ranked_points > s2021_max {
                s2021_max = ranked_points;
            }
        }
        if account.current_rank != "N/A" {
            lp_points = account.current_rank_lp.parse::<i32>().unwrap() / 100;
            let rank = &account.current_rank;
            for i in 0..RANKPOINTTABLE.len(){
                if RANKPOINTTABLE[i].0 == rank {
                    ranked_points = RANKPOINTTABLE[i].1 as i32;
                    ranked_point_index = i;
                    break;
                }
            }
            if rank == "CHALLENGER 1" {
                ranked_point_index = 1;
            }
            lp_points = lp_points * (RANKPOINTTABLE[ranked_point_index-1].1 as i32 - ranked_points);
            if ranked_points < 40 {
                ranked_points = ranked_points + lp_points;
            }
            if ranked_points > current_rank_max {
                current_rank_max = ranked_points;
            }
        }
        if account.number_of_games > games_max_account.number_of_games {
            games_max_account = account;
        }
    }
    if games_max_account != AccountInfo::new() {
        let mut account = games_max_account;
        lp_points = account.current_rank_lp.parse::<i32>().unwrap() / 100;
        let rank = &account.current_rank;
        for i in 0..RANKPOINTTABLE.len(){
            if RANKPOINTTABLE[i].0 == rank {
                ranked_points = RANKPOINTTABLE[i].1 as i32;
                ranked_point_index = i;
                break;
            }
        }
        if rank == "CHALLENGER 1" {
            ranked_point_index = 1;
        }
        lp_points = lp_points * (RANKPOINTTABLE[ranked_point_index-1].1 as i32 - ranked_points);
        if account.number_of_games.parse::<i64>().unwrap() > 300 {
            account.number_of_games = 300.to_string();
        } else if account.number_of_games.parse::<i64>().unwrap() < 30 {
            account.number_of_games = 30.to_string();
        }
        let game_played_points  = (a * f32::powi(account.number_of_games.parse::<f32>().unwrap(),2) + b * account.number_of_games.parse::<f32>().unwrap() + c)/2.0;
        if ranked_points >= 40 {
            ranked_points = ranked_points + game_played_points as i32;
        } else {
            ranked_points = ranked_points + lp_points + game_played_points as i32;
        }
        current_rank_points = ranked_points;
    }
    let account_level_points = a * f32::powi(account_level_max as f32,2) + b * account_level_max as f32 + c;
    let player = [
        s2020_max,
        s2021_max,
        current_rank_max,
        current_rank_points,
    ];
    let mut player_points = 0;
    for i in 0..player.len() {
        if player[i] > player_points {
            player_points = player[i];
        }
    }
    player_points = player_points + account_level_points as i32;
    if player_points > 45 {
        player_points = 45;
    }
    Ok(player_points.into())
}