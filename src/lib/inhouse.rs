use std::collections::HashMap;
use serenity::model::id::UserId;
use serenity::prelude::Context;
use lazy_static::lazy_static;
use std::sync::Mutex;
use scraper::{Html, Selector};
use phf::phf_map;
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

static RANKPOINTTABLE: phf::Map<&'static str, i8> = phf_map! {
    "CHALLENGER 1" => 45,
    "GRANDMASTER 1" => 42,
    "MASTER 1" => 40,
    "DIAMOND 1" => 36,
    "DIAMOND 2" => 34,
    "DIAMOND 3" => 31,
    "DIAMOND 4" => 29,
    "PLATINUM 1" => 27,
    "PLATINUM 2" => 26,
    "PLATINUM 3" => 23,
    "PLATINUM 4" => 21,
    "GOLD 1" => 20,
    "GOLD 2" => 19,
    "GOLD 3" => 18,
    "GOLD 4" => 17,
    "SILVER 1" => 16,
    "SILVER 2" => 16,
    "SILVER 3" => 15,
    "SILVER 4" => 15,
    "BRONZE 1" => 15,
    "BRONZE 2" => 15,
    "BRONZE 3" => 15,
    "BRONZE 4" => 15,
    "IRON 1" => 15,
    "IRON 2" => 15,
    "IRON 3" => 15,
    "IRON 4" => 15,
};

static WINRATEPOINTTABLE: phf::Map<&'static str, f32> = phf_map! {
    "70%" => 3.0,
    "69%" => 2.8,
    "68%" => 2.6,
    "67%" => 2.4,
    "66%" => 2.2,
    "65%" => 2.0,
    "64%" => 1.8,
    "63%" => 1.6,
    "62%" => 1.4,
    "61%" => 1.2,
    "60%" => 1.0,
    "59%" => 0.88,
    "58%" => 0.75,
    "57%" => 0.63,
    "56%" => 0.5,
    "55%" => 0.38,
    "54%" => 0.25,
    "53%" => 0.13,
    "52%" => 0.0,
    "51%" => 0.0,
    "50%" => 0.0,
    "49%" => 0.0,
    "48%" => 0.0,
    "47%" => -0.06,
    "46%" => -0.13,
    "45%" => -0.19,
    "44%" => -0.25,
    "43%" => -0.31,
    "42%" => -0.38,
    "41%" => -0.44,
    "40%" => -0.5,
};

pub struct QueueManager{
    top: Vec<UserId>, // discord_id
    jungle: Vec<UserId>,
    mid: Vec<UserId>,
    bot: Vec<UserId>,
    support: Vec<UserId>,
    players: HashMap<UserId, Player>, //key: discord id, value: Player
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
            top: Vec::new(),
            jungle: Vec::new(),
            mid: Vec::new(),
            bot: Vec::new(),
            support: Vec::new(),
            players: HashMap::new(),
            current_games: Vec::new(),
        }
    }

    pub fn check_registered_player(&mut self, discord_id: UserId) -> Result<(), &str>{
        if self.players.contains_key(&discord_id){
            return Err("Player already registered");
        }
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
            if p.queued.len() > 2 {
                return Err("Player is already in queue for two roles");
            }
            let role = role.to_lowercase();
            //Add more aliases for roles 
            match role.as_str() {
                "top" => {
                    p.queued.push(role.clone()); 
                    self.top.push(discord_id);
                },
                "jungle" => {
                    p.queued.push(role.clone());
                    self.jungle.push(discord_id);
                },
                "mid" => {
                    p.queued.push(role.clone());
                    self.mid.push(discord_id);
                },
                "bot" => {
                    p.queued.push(role.clone());
                    self.bot.push(discord_id);
                },
                "support" => {
                    p.queued.push(role.clone());
                    self.support.push(discord_id);
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
    
    pub async fn display(&self, ctx: &Context) -> String{
        let mut output = String::new();
        output.push_str(&TOP_EMOJI.lock().unwrap());
        for player in self.top.iter(){
            let name = player.to_user(&ctx.http).await.unwrap().name;
            output.push_str(&name);
            output.push_str(" ");
        }
        output.push_str("\n");

        output.push_str(&JG_EMOJI.lock().unwrap());
        for player in self.jungle.iter(){
            let name = player.to_user(&ctx.http).await.unwrap().name;
            output.push_str(&name);
            output.push_str(" ");
        }
        output.push_str("\n");

        output.push_str(&MID_EMOJI.lock().unwrap());
        for player in self.mid.iter(){
            let name = player.to_user(&ctx.http).await.unwrap().name;
            output.push_str(&name);
            output.push_str(" ");
        }
        output.push_str("\n");

        output.push_str(&BOT_EMOJI.lock().unwrap());
        for player in self.bot.iter(){
            let name = player.to_user(&ctx.http).await.unwrap().name;
            output.push_str(&name);
            output.push_str(" ");
        }
        output.push_str("\n");

        output.push_str(&SUP_EMOJI.lock().unwrap());
        for player in self.support.iter(){
            let name = player.to_user(&ctx.http).await.unwrap().name;
            output.push_str(&name);
            output.push_str(" ");
        }
        output.push_str("\n");
        output
    }
}

struct Rank {
    tier: String,
    division: String,
    lp: String,
    error: bool,
}

struct AccountInfo {
    name: String,
    account_level: i64,
    rank2021: Rank,
    rank2020: Rank,
    current_rank: String,
    number_of_games: String,
    winrate: String,
}
//TODO remove boilerplate code and generally clean up code and make it more readable. Also try to remove some of the magic numbers
pub async fn get_msl_points(opggs: Vec<(String,String,i64)>, riot_key: &str) -> Result<i8, &'static str> {
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
        for entry in ranked_info {
            if entry.queue_type == QueueType::RANKED_SOLO_5x5 {
                winrate = format!("{}%", (entry.wins as f32 / (entry.wins + entry.losses) as f32 * 100.0) as i64);
                number_of_games = format!("{}", entry.wins + entry.losses);
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
                current_rank = format!("{} {}", tier.to_uppercase(), division);
                break;
            }
        }
        let account = AccountInfo{
            name: opgg,
            account_level: level,
            current_rank,
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
    let account_level_max: i64 = 100;
    let s2020_max = 0;
    let s2021_max = 0;


    Ok(1)
}