use std::collections::{HashMap, HashSet, VecDeque};
use serenity::model::id::{UserId, GuildId};
use serenity::prelude::Context;
use lazy_static::lazy_static;
use std::sync::Mutex;
use scraper::{Html, Selector};
use serde_json::{Value};
use riven::consts::PlatformRoute::NA1;
use riven::consts::{QueueType,Tier,Division};
use riven::RiotApi;

//TODO store values in database for future use after restart and load them on startup
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
}

#[derive(Debug)]
pub struct Player{
    pub riot_accounts: Vec<String>, // list of puuids for each account 
    pub queued: Vec<String>,
    pub initial_rating: i32,
}

struct Game {
    players: Vec<Player>, 
}

impl QueueManager{
    pub fn new() -> QueueManager{
        QueueManager{
            top: VecDeque::new(),
            jungle: VecDeque::new(),
            mid: VecDeque::new(),
            bot: VecDeque::new(),
            support: VecDeque::new(),
            players: HashMap::new(),
            current_games: Vec::new(),
        }
    }

    pub fn check_registered_player(&mut self, discord_id: UserId) -> Result<(), &str>{
        if self.players.contains_key(&discord_id){
            return Err("Player already registered");
        }
        //TODO remove this logic and place it below in the register_player function once the point calculations are implemented
        let player = Player{
            riot_accounts: Vec::new(),
            queued: Vec::new(),
            initial_rating: 0,
        };
        self.players.insert(discord_id, player);
        //TODO save player to database
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

    pub fn register_player(&self){
        //TODO
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
            //TODO create game and add to current_games
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
        //TODO update to show server name, not account name
        let mut output = String::new();
        output.push_str(&TOP_EMOJI.lock().unwrap());
        for player in self.top.iter(){
            let name;
            let username = player.to_user(&ctx.http).await.unwrap().name;
            name = player.to_user(&ctx.http).await.unwrap().nick_in(&ctx.http, guild_id).await.unwrap_or_else(|| username);
            output.push_str(&name);
            output.push_str(" ");
        }
        output.push_str("\n");

        output.push_str(&JG_EMOJI.lock().unwrap());
        for player in self.jungle.iter(){
            let name;
            let username = player.to_user(&ctx.http).await.unwrap().name;
            name = player.to_user(&ctx.http).await.unwrap().nick_in(&ctx.http, guild_id).await.unwrap_or_else(|| username);
            output.push_str(&name);
            output.push_str(" ");
        }
        output.push_str("\n");

        output.push_str(&MID_EMOJI.lock().unwrap());
        for player in self.mid.iter(){
            let name;
            let username = player.to_user(&ctx.http).await.unwrap().name;
            name = player.to_user(&ctx.http).await.unwrap().nick_in(&ctx.http, guild_id).await.unwrap_or_else(|| username);
            output.push_str(&name);
            output.push_str(" ");
        }
        output.push_str("\n");

        output.push_str(&BOT_EMOJI.lock().unwrap());
        for player in self.bot.iter(){
            let name;
            let username = player.to_user(&ctx.http).await.unwrap().name;
            name = player.to_user(&ctx.http).await.unwrap().nick_in(&ctx.http, guild_id).await.unwrap_or_else(|| username);
            output.push_str(&name);
            output.push_str(" ");
        }
        output.push_str("\n");

        output.push_str(&SUP_EMOJI.lock().unwrap());
        for player in self.support.iter(){
            let name;
            let username = player.to_user(&ctx.http).await.unwrap().name;
            name = player.to_user(&ctx.http).await.unwrap().nick_in(&ctx.http, guild_id).await.unwrap_or_else(|| username);
            output.push_str(&name);
            output.push_str(" ");
        }
        output.push_str("\n");
        output
    }
}

#[derive(PartialEq)]
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

#[derive(PartialEq)]
struct AccountInfo {
    name: String,
    account_level: i64,
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
pub async fn get_msl_points(opggs: Vec<(String,String,i64)>, riot_key: &str) -> Result<i64, &'static str> {
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
                if let Some(division) = json["props"]["pageProps"]["data"]["previous_seasons"][0]["tier_info"]["division"].as_str() {
                    rank2021.division = division.to_string();
                } else {
                    rank2021.error = true;
                }
                let test = &json["props"]["pageProps"]["data"]["previous_seasons"][0]["tier_info"]["lp"];
                if test.is_string() {
                    rank2021.lp = test.as_str().unwrap().to_string();
                } else {
                    rank2021.lp = "N/A".to_string();
                }
            }
            if lastseason2 {
                if let Some(rank) = json["props"]["pageProps"]["data"]["previous_seasons"][1]["tier_info"]["tier"].as_str() {
                    rank2020.tier = rank.to_string();
                } else {
                    rank2020.error = true;
                }
                if let Some(division) = json["props"]["pageProps"]["data"]["previous_seasons"][1]["tier_info"]["division"].as_str() {
                    rank2020.division = division.to_string();
                } else {
                    rank2020.error = true;
                }
                let test = &json["props"]["pageProps"]["data"]["previous_seasons"][1]["tier_info"]["lp"];
                if test.is_string() {
                    rank2020.lp = test.as_str().unwrap().to_string();
                } else {
                    rank2020.lp = "N/A".to_string();
                }
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
    let a: f64 = 4.0/57600.0;
    let b: f64 = a * -600.0;
    let c: f64 = a * 90000.0;
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
        if account.account_level > account_level_max {
            account_level_max = account.account_level;
        }
        if !account.rank2020.error {
            lp_points = account.rank2020.lp.parse::<i64>().unwrap() / 100;
            let rank = &format!("{} {}",account.rank2020.tier.to_uppercase(),account.rank2020.division);
            for i in 0..RANKPOINTTABLE.len(){
                if RANKPOINTTABLE[i].0 == rank {
                    ranked_points = RANKPOINTTABLE[i].1 as i64;
                    ranked_point_index = i;
                    break;
                }
            }
            if ranked_point_index == 0 {
                ranked_point_index = 1;
            }
            lp_points = lp_points * (RANKPOINTTABLE[ranked_point_index-1].1 as i64 - ranked_points);
            if ranked_points < 40 {
                ranked_points = ranked_points + lp_points;
            }
            if ranked_points > s2020_max {
                s2020_max = ranked_points;
            }
        }
        if !account.rank2021.error {
            lp_points = account.rank2021.lp.parse::<i64>().unwrap() / 100;
            let rank = &format!("{} {}",account.rank2021.tier.to_uppercase(),account.rank2021.division);
            for i in 0..RANKPOINTTABLE.len(){
                if RANKPOINTTABLE[i].0 == rank {
                    ranked_points = RANKPOINTTABLE[i].1 as i64;
                    ranked_point_index = i;
                    break;
                }
            }
            if rank == "CHALLENGER 1" {
                ranked_point_index = 1;
            }
            lp_points = lp_points * (RANKPOINTTABLE[ranked_point_index-1].1 as i64 - ranked_points);
            if ranked_points < 40 {
                ranked_points = ranked_points + lp_points;
            }
            if ranked_points > s2021_max {
                s2021_max = ranked_points;
            }
        }
        if account.current_rank != "N/A" {
            lp_points = account.current_rank_lp.parse::<i64>().unwrap() / 100;
            let rank = &account.current_rank;
            for i in 0..RANKPOINTTABLE.len(){
                if RANKPOINTTABLE[i].0 == rank {
                    ranked_points = RANKPOINTTABLE[i].1 as i64;
                    ranked_point_index = i;
                    break;
                }
            }
            if rank == "CHALLENGER 1" {
                ranked_point_index = 1;
            }
            lp_points = lp_points * (RANKPOINTTABLE[ranked_point_index-1].1 as i64 - ranked_points);
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
        lp_points = account.current_rank_lp.parse::<i64>().unwrap() / 100;
        let rank = &account.current_rank;
        for i in 0..RANKPOINTTABLE.len(){
            if RANKPOINTTABLE[i].0 == rank {
                ranked_points = RANKPOINTTABLE[i].1 as i64;
                ranked_point_index = i;
                break;
            }
        }
        if rank == "CHALLENGER 1" {
            ranked_point_index = 1;
        }
        lp_points = lp_points * (RANKPOINTTABLE[ranked_point_index-1].1 as i64 - ranked_points);
        if account.number_of_games.parse::<i64>().unwrap() > 300 {
            account.number_of_games = 300.to_string();
        } else if account.number_of_games.parse::<i64>().unwrap() < 30 {
            account.number_of_games = 30.to_string();
        }
        let game_played_points  = (a * f64::powi(account.number_of_games.parse::<f64>().unwrap(),2) + b * account.number_of_games.parse::<f64>().unwrap() + c)/2.0;
        if ranked_points >= 40 {
            ranked_points = ranked_points + game_played_points as i64;
        } else {
            ranked_points = ranked_points + lp_points + game_played_points as i64;
        }
        current_rank_points = ranked_points;
    }
    let account_level_points = a * f64::powi(account_level_max as f64,2) + b * account_level_max as f64 + c;
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
    player_points = player_points + account_level_points as i64;
    if player_points > 45 {
        player_points = 45;
    }
    Ok(player_points)
}