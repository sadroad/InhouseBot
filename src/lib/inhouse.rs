use crate::display;
use crate::lib::database::{get_players, next_game_id, remove_player, save_player};
use crate::lib::openskill::lib::{predicte_win, Rating, DEFAULT_SIGMA};
use crate::{DBCONNECTION, LOADING_EMOJI};
use itertools::{iproduct, Itertools};
use lazy_static::lazy_static;
use riven::consts::PlatformRoute::NA1;
use riven::consts::{Division, QueueType, Tier};
use riven::RiotApi;
use scraper::{Html, Selector};
use serde_json::Value;
use serenity::model::channel::ReactionType;
use serenity::model::id::{ChannelId, GuildId, MessageId, UserId};
use serenity::prelude::Context;
use std::collections::{HashMap, HashSet, VecDeque};
use std::sync::Mutex;

use tracing::log::info;

lazy_static! {
    pub static ref TOP_EMOJI: Mutex<String> = Mutex::new(String::from(":frog: "));
    pub static ref JG_EMOJI: Mutex<String> = Mutex::new(String::from(":dog: "));
    pub static ref MID_EMOJI: Mutex<String> = Mutex::new(String::from(":cat: "));
    pub static ref BOT_EMOJI: Mutex<String> = Mutex::new(String::from(":blue_car: "));
    pub static ref SUP_EMOJI: Mutex<String> = Mutex::new(String::from(":police_car: "));
}

static RANKPOINTTABLE: [(&str, i8); 27] = [
    ("CHALLENGER 1", 45),
    ("GRANDMASTER 1", 42),
    ("MASTER 1", 40),
    ("DIAMOND 1", 36),
    ("DIAMOND 2", 34),
    ("DIAMOND 3", 31),
    ("DIAMOND 4", 29),
    ("PLATINUM 1", 27),
    ("PLATINUM 2", 26),
    ("PLATINUM 3", 23),
    ("PLATINUM 4", 21),
    ("GOLD 1", 20),
    ("GOLD 2", 19),
    ("GOLD 3", 18),
    ("GOLD 4", 17),
    ("SILVER 1", 16),
    ("SILVER 2", 16),
    ("SILVER 3", 15),
    ("SILVER 4", 15),
    ("BRONZE 1", 15),
    ("BRONZE 2", 15),
    ("BRONZE 3", 15),
    ("BRONZE 4", 15),
    ("IRON 1", 15),
    ("IRON 2", 15),
    ("IRON 3", 15),
    ("IRON 4", 15),
];

pub struct QueueManager {
    top: VecDeque<UserId>, // discord_id
    jungle: VecDeque<UserId>,
    mid: VecDeque<UserId>,
    bot: VecDeque<UserId>,
    support: VecDeque<UserId>,
    players: HashMap<UserId, Player>, //key: discord id, value: Player
    current_games: Vec<Game>,
    pub tentative_games: Vec<Game>,
}

#[derive(Debug, Clone)]
pub struct Player {
    pub riot_accounts: Vec<String>, // list of puuids for each account
    pub queued: Vec<String>,
    pub rating: Rating,
}

#[derive(Clone)]
pub struct Game {
    pub id: i32,
    pub displayed: bool,
    pub message_id: MessageId,
    pub expected_winrate: f64,
    top: [(UserId, bool); 2],
    jungle: [(UserId, bool); 2],
    mid: [(UserId, bool); 2],
    bot: [(UserId, bool); 2],
    support: [(UserId, bool); 2],
}

impl Game {
    fn new(queue: &QueueManager, expected_winrate: f64) -> Game {
        Game {
            id: {
                if queue.tentative_games.is_empty() {
                    if queue.current_games.is_empty() {
                        let conn = DBCONNECTION.db_connection.get().unwrap();
                        next_game_id(&conn)
                    } else {
                        queue.current_games.last().unwrap().id + 1
                    }
                } else {
                    queue.tentative_games.last().unwrap().id + 1
                }
            },
            expected_winrate,
            displayed: false,
            message_id: MessageId(0),
            top: [(UserId(0), false); 2],
            jungle: [(UserId(0), false); 2],
            mid: [(UserId(0), false); 2],
            bot: [(UserId(0), false); 2],
            support: [(UserId(0), false); 2],
        }
    }
    fn from(queue: &QueueManager, teams: Vec<Vec<UserId>>, blue_winrate: f64) -> Game {
        let mut game = Game::new(queue, blue_winrate);
        for (i, team) in teams.iter().enumerate() {
            for (j, player) in team.iter().enumerate() {
                if player == &UserId(0)
                    || player == &UserId(1)
                    || player == &UserId(2)
                    || player == &UserId(3)
                    || player == &UserId(4)
                    || player == &UserId(5)
                    || player == &UserId(6)
                    || player == &UserId(7)
                    || player == &UserId(8)
                    || player == &UserId(9)
                {
                    match j {
                        0 => game.top[i] = (*player, true),
                        1 => game.jungle[i] = (*player, true),
                        2 => game.mid[i] = (*player, true),
                        3 => game.bot[i] = (*player, true),
                        4 => game.support[i] = (*player, true),
                        _ => panic!("Too many players in a team"),
                    }
                } else {
                    match j {
                        0 => game.top[i] = (*player, false),
                        1 => game.jungle[i] = (*player, false),
                        2 => game.mid[i] = (*player, false),
                        3 => game.bot[i] = (*player, false),
                        4 => game.support[i] = (*player, false),
                        _ => panic!("Too many players in a team"),
                    }
                }
            }
        }
        game
    }

    pub async fn unready(&mut self, user_reactor: UserId, emoji: &ReactionType) -> bool {
        if emoji == &ReactionType::Unicode(String::from("✅")) {
            let players = self
                .top
                .iter_mut()
                .chain(self.jungle.iter_mut())
                .chain(self.mid.iter_mut())
                .chain(self.bot.iter_mut())
                .chain(self.support.iter_mut());
            for player in players {
                if player.0 == user_reactor {
                    player.1 = false;
                    return true;
                }
            }
        }
        false
    }

    pub async fn get_afk_players(&self) -> HashSet<UserId> {
        let mut afk_players = HashSet::new();
        let players = self
            .top
            .iter()
            .chain(self.jungle.iter())
            .chain(self.mid.iter())
            .chain(self.bot.iter())
            .chain(self.support.iter());
        for player in players {
            if !player.1 {
                afk_players.insert(player.0.clone());
            }
        }
        afk_players
    }

    pub async fn update_status(
        &mut self,
        user_reactor: UserId,
        emoji: &ReactionType,
    ) -> Result<(), UserId> {
        if emoji == &ReactionType::Unicode(String::from("✅")) {
            let players = self
                .top
                .iter_mut()
                .chain(self.jungle.iter_mut())
                .chain(self.mid.iter_mut())
                .chain(self.bot.iter_mut())
                .chain(self.support.iter_mut());
            for player in players {
                if player.0 == user_reactor {
                    player.1 = true;
                    return Ok(());
                }
            }
        }
        if emoji == &ReactionType::Unicode(String::from("❌")) {
            return Err(user_reactor);
        }
        Ok(())
    }

    pub async fn is_ready(&self) -> bool {
        let players = self
            .top
            .iter()
            .chain(self.jungle.iter())
            .chain(self.mid.iter())
            .chain(self.bot.iter())
            .chain(self.support.iter());
        for player in players {
            if !player.1 {
                return false;
            }
        }
        true
    }

    fn team(&self, index: usize) -> Vec<(UserId, i8)> {
        let mut team = Vec::new();
        team.push((self.top[index].0, 0));
        team.push((self.jungle[index].0, 1));
        team.push((self.mid[index].0, 2));
        team.push((self.bot[index].0, 3));
        team.push((self.support[index].0, 4));
        team
    }

    pub async fn display(&self, ctx: &Context, guild_id: GuildId) -> (String, String) {
        let teams = vec![
            [
                self.top[0],
                self.jungle[0],
                self.mid[0],
                self.bot[0],
                self.support[0],
            ],
            [
                self.top[1],
                self.jungle[1],
                self.mid[1],
                self.bot[1],
                self.support[1],
            ],
        ];
        let mut return_string = Vec::new();
        for team in teams {
            let mut tmp = String::new();
            for (i, player) in team.iter().enumerate() {
                let name = get_name(&player.0, &ctx, guild_id).await;
                match i {
                    0 => tmp.push_str(&TOP_EMOJI.lock().unwrap()),
                    1 => tmp.push_str(&JG_EMOJI.lock().unwrap()),
                    2 => tmp.push_str(&MID_EMOJI.lock().unwrap()),
                    3 => tmp.push_str(&BOT_EMOJI.lock().unwrap()),
                    4 => tmp.push_str(&SUP_EMOJI.lock().unwrap()),
                    _ => panic!("Too many players in a team"),
                };
                if player.1 {
                    tmp.push_str("✅ ");
                } else {
                    tmp.push_str(&LOADING_EMOJI);
                }
                tmp.push_str(&name);
                tmp.push('\n');
            }
            return_string.push(tmp);
        }
        (return_string[0].clone(), return_string[1].clone())
    }
}

impl QueueManager {
    pub fn new() -> QueueManager {
        let mut queue = QueueManager {
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
        for player in result {
            queue.players.insert(player.0, player.1);
        }
        queue
    }

    pub fn check_registered_player(&self, discord_id: UserId) -> Result<(), &str> {
        if self.players.contains_key(&discord_id) {
            return Err("Player already registered");
        }
        Ok(())
    }

    pub fn check_puuid(&self, puuid: &str) -> Result<(), ()> {
        for player in self.players.values() {
            if player.riot_accounts.contains(&puuid.to_string()) {
                return Err(());
            }
        }
        Ok(())
    }

    pub fn unregister_player(&mut self, discord_id: UserId) {
        self.players.remove(&discord_id);
        {
            let conn = DBCONNECTION.db_connection.get().unwrap();
            remove_player(&conn, &discord_id);
        }
    }

    pub fn register_player(
        &mut self,
        discord_id: UserId,
        accounts: Vec<String>,
        msl_sigma_value: f64,
    ) {
        let player = Player {
            riot_accounts: accounts,
            queued: Vec::new(),
            rating: Rating::from(
                discord_id,
                msl_sigma_value,
                DEFAULT_SIGMA * (1.0 + (msl_sigma_value / 100.0)),
            ),
        };
        {
            let conn = DBCONNECTION.db_connection.get().unwrap();
            save_player(&conn, &discord_id, &player);
        }
        self.players.insert(discord_id, player);
    }

    pub fn queue_player(&mut self, discord_id: UserId, role: &str) -> Result<(), &str> {
        if !self.players.contains_key(&discord_id) {
            return Err("Player not registered.");
        }
        if let Some(p) = self.players.get_mut(&discord_id) {
            if p.queued.contains(&role.to_string()) {
                return Err("Player is already in queue for this role");
            }
            if p.queued.len() >= 2 {
                return Err("Player is already in queue for two roles");
            }
            let role = role.to_lowercase();
            //TODO Add more aliases for roles
            match role.as_str() {
                "top" => {
                    p.queued.push("top".to_string());
                    self.top.push_back(discord_id);
                }
                "jungle" | "jung" | "jg" | "jng" => {
                    p.queued.push("jungle".to_string());
                    self.jungle.push_back(discord_id);
                }
                "mid" => {
                    p.queued.push("mid".to_string());
                    self.mid.push_back(discord_id);
                }
                "bot" | "adc" | "bottom" => {
                    p.queued.push("bot".to_string());
                    self.bot.push_back(discord_id);
                }
                "support" | "sup" => {
                    p.queued.push("support".to_string());
                    self.support.push_back(discord_id);
                }
                _ => return Err("Invalid role"),
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
            match role.as_str() {
                //TODO add more aliases for roles
                //FIXME doesn't check for aliases
                "top" => {
                    self.top.retain(|player| player != discord_id);
                    player.queued.retain(|role| role != "top");
                }
                "jungle" | "jung" | "jg" | "jng" => {
                    self.jungle.retain(|player| player != discord_id);
                    player.queued.retain(|role| role != "jungle");
                }
                "mid" => {
                    self.mid.retain(|player| player != discord_id);
                    player.queued.retain(|role| role != "mid");
                }
                "bot" | "adc" | "bottom" => {
                    self.bot.retain(|player| player != discord_id);
                    player.queued.retain(|role| role != "bot");
                }
                "support" | "sup" => {
                    self.support.retain(|player| player != discord_id);
                    player.queued.retain(|role| role != "support");
                }
                _ => {
                    self.top.retain(|player| player != discord_id);
                    self.jungle.retain(|player| player != discord_id);
                    self.mid.retain(|player| player != discord_id);
                    self.bot.retain(|player| player != discord_id);
                    self.support.retain(|player| player != discord_id);
                    player.queued.clear();
                }
            }
        }
        Ok(())
    }

    pub async fn number_of_unique_players(&self) -> usize {
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

    async fn find_game(&mut self) -> Game {
        //TODO this needs a lot of work, no O(n^2), disgusting function just rewrite
        let mut final_team: Vec<Vec<UserId>> = Vec::new();
        let mut index = 0;
        let mut team1_winrate = 0.0;
        let mut tmp_top: VecDeque<UserId> = VecDeque::new();
        let mut tmp_jungle: VecDeque<UserId> = VecDeque::new();
        let mut tmp_mid: VecDeque<UserId> = VecDeque::new();
        let mut tmp_bot: VecDeque<UserId> = VecDeque::new();
        let mut tmp_support: VecDeque<UserId> = VecDeque::new();
        let longest_queue = self
            .top
            .len()
            .max(self.jungle.len())
            .max(self.mid.len())
            .max(self.bot.len())
            .max(self.support.len());
        while final_team.is_empty() && index < longest_queue {
            while let Some(player) = self.top.pop_front() {
                if tmp_top.len() < 1 + index {
                    tmp_top.push_back(player);
                } else {
                    tmp_top.push_back(player);
                    break;
                }
            }
            while let Some(player) = self.jungle.pop_front() {
                if tmp_jungle.len() < 1 + index {
                    tmp_jungle.push_back(player);
                } else {
                    tmp_jungle.push_back(player);
                    break;
                }
            }
            while let Some(player) = self.mid.pop_front() {
                if tmp_mid.len() < 1 + index {
                    tmp_mid.push_back(player);
                } else {
                    tmp_mid.push_back(player);
                    break;
                }
            }
            while let Some(player) = self.bot.pop_front() {
                if tmp_bot.len() < 1 + index {
                    tmp_bot.push_back(player);
                } else {
                    tmp_bot.push_back(player);
                    break;
                }
            }
            while let Some(player) = self.support.pop_front() {
                if tmp_support.len() < 1 + index {
                    tmp_support.push_back(player);
                } else {
                    tmp_support.push_back(player);
                    break;
                }
            }
            'outer: for (top, jng, mid, bot, sup) in iproduct!(
                tmp_top.iter().cloned(),
                tmp_jungle.iter().cloned(),
                tmp_mid.iter().cloned(),
                tmp_bot.iter().cloned(),
                tmp_support.iter().cloned()
            ) {
                for (top2, jng2, mid2, bot2, sup2) in iproduct!(
                    tmp_top.iter().cloned(),
                    tmp_jungle.iter().cloned(),
                    tmp_mid.iter().cloned(),
                    tmp_bot.iter().cloned(),
                    tmp_support.iter().cloned()
                ) {
                    //TODO this is a hack, but it works for now
                    if top == top2
                        || top == jng2
                        || top == mid2
                        || top == bot2
                        || top == sup2
                        || jng == top2
                        || jng == jng2
                        || jng == mid2
                        || jng == bot2
                        || jng == sup2
                        || mid == top2
                        || mid == jng2
                        || mid == mid2
                        || mid == bot2
                        || mid == sup2
                        || bot == top2
                        || bot == jng2
                        || bot == mid2
                        || bot == bot2
                        || bot == sup2
                        || sup == top2
                        || sup == jng2
                        || sup == mid2
                        || sup == bot2
                        || sup == sup2
                        || top == jng
                        || top == mid
                        || top == bot
                        || top == sup
                        || jng == mid
                        || jng == bot
                        || jng == sup
                        || mid == bot
                        || mid == sup
                        || bot == sup
                        || top2 == jng2
                        || top2 == mid2
                        || top2 == bot2
                        || top2 == sup2
                        || jng2 == mid2
                        || jng2 == bot2
                        || jng2 == sup2
                        || mid2 == bot2
                        || mid2 == sup2
                        || bot2 == sup2
                    {
                        continue;
                    }

                    let team1 = vec![
                        self.players.get(&top).unwrap().rating.clone(),
                        self.players.get(&jng).unwrap().rating.clone(),
                        self.players.get(&mid).unwrap().rating.clone(),
                        self.players.get(&bot).unwrap().rating.clone(),
                        self.players.get(&sup).unwrap().rating.clone(),
                    ];
                    let team2 = vec![
                        self.players.get(&top2).unwrap().rating.clone(),
                        self.players.get(&jng2).unwrap().rating.clone(),
                        self.players.get(&mid2).unwrap().rating.clone(),
                        self.players.get(&bot2).unwrap().rating.clone(),
                        self.players.get(&sup2).unwrap().rating.clone(),
                    ];
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
            while let Some(player) = tmp_top.pop_back() {
                self.top.push_front(player);
            }
            while let Some(player) = tmp_jungle.pop_back() {
                self.jungle.push_front(player);
            }
            while let Some(player) = tmp_mid.pop_back() {
                self.mid.push_front(player);
            }
            while let Some(player) = tmp_bot.pop_back() {
                self.bot.push_front(player);
            }
            while let Some(player) = tmp_support.pop_back() {
                self.support.push_front(player);
            }
            index += 1;
        }
        while let Some(player) = tmp_top.pop_back() {
            self.top.push_front(player);
        }
        while let Some(player) = tmp_jungle.pop_back() {
            self.jungle.push_front(player);
        }
        while let Some(player) = tmp_mid.pop_back() {
            self.mid.push_front(player);
        }
        while let Some(player) = tmp_bot.pop_back() {
            self.bot.push_front(player);
        }
        while let Some(player) = tmp_support.pop_back() {
            self.support.push_front(player);
        }
        for (i, player) in final_team[0].iter().enumerate() {
            match i {
                0 => self.leave_queue(*player, "").unwrap(),
                1 => self.leave_queue(*player, "").unwrap(),
                2 => self.leave_queue(*player, "").unwrap(),
                3 => self.leave_queue(*player, "").unwrap(),
                4 => self.leave_queue(*player, "").unwrap(),
                _ => panic!("Invalid index"),
            };
        }
        for (i, player) in final_team[1].iter().enumerate() {
            match i {
                0 => self.leave_queue(*player, "").unwrap(),
                1 => self.leave_queue(*player, "").unwrap(),
                2 => self.leave_queue(*player, "").unwrap(),
                3 => self.leave_queue(*player, "").unwrap(),
                4 => self.leave_queue(*player, "").unwrap(),
                _ => panic!("Invalid index"),
            };
        }
        Game::from(self, final_team, team1_winrate)
    }

    fn get_roles(&self, player: &UserId) -> Option<Vec<&str>> {
        let mut roles = Vec::new();
        if self.top.contains(player) {
            roles.push("Top");
        }
        if self.jungle.contains(player) {
            roles.push("Jungle");
        }
        if self.mid.contains(player) {
            roles.push("Mid");
        }
        if self.bot.contains(player) {
            roles.push("Bot");
        }
        if self.support.contains(player) {
            roles.push("Support");
        }
        if roles.is_empty() {
            None
        } else {
            Some(roles)
        }
    }
    fn check_duplicates(&self) -> (bool, HashSet<&str>) {
        /*
           top - sadroad, lelantos
           mid - sadroad, lelantos
           still missing two players from the top and mid roles
        */
        let mut players = HashSet::new();
        let mut duplicates = HashSet::new();
        for player in self
            .top
            .iter()
            .merge(self.jungle.iter())
            .merge(self.mid.iter())
            .merge(self.bot.iter())
            .merge(self.support.iter())
        {
            if !players.insert(player) {
                duplicates.insert(player);
            }
        }
        //find roles of duplicates
        let mut roles: HashSet<&str> = HashSet::new();
        for player in duplicates.iter() {
            if let Some(player_roles) = self.get_roles(player) {
                for role in player_roles {
                    roles.insert(role);
                }
            }
        }
        (false, roles)
    }
    pub async fn check_for_game(&mut self) -> Option<String> {
        let missing_roles = self.check_duplicates();
        //TODO Check for duplicate players across roles
        if self.top.len() >= 2
            && self.jungle.len() >= 2
            && self.mid.len() >= 2
            && self.bot.len() >= 2
            && self.support.len() >= 2
            && self.number_of_unique_players().await >= 10
            && !missing_roles.0
        {
            info!("Starting game");
            let game = self.find_game().await;
            self.tentative_games.push(game);
        } else {
            //TODO Roles are not shown in order but like cba
            let mut missing_roles = missing_roles.1;
            if self.top.len() < 2 {
                missing_roles.insert("Top");
            }
            if self.jungle.len() < 2 {
                missing_roles.insert("Jungle");
            }
            if self.mid.len() < 2 {
                missing_roles.insert("Mid");
            }
            if self.bot.len() < 2 {
                missing_roles.insert("Bot");
            }
            if self.support.len() < 2 {
                missing_roles.insert("Support");
            }
            if !missing_roles.is_empty() {
                return Some(missing_roles.iter().join(", "));
            }
        }
        None
    }

    pub async fn display(&self, ctx: &Context, guild_id: GuildId) -> String {
        let mut output = String::new();
        output.push_str(&TOP_EMOJI.lock().unwrap());
        for player in self.top.iter() {
            let name = get_name(player, &ctx, guild_id).await;
            output.push_str(&name);
            output.push(' ');
        }
        output.push('\n');

        output.push_str(&JG_EMOJI.lock().unwrap());
        for player in self.jungle.iter() {
            let name = get_name(player, &ctx, guild_id).await;
            output.push_str(&name);
            output.push(' ');
        }
        output.push('\n');

        output.push_str(&MID_EMOJI.lock().unwrap());
        for player in self.mid.iter() {
            let name = get_name(player, &ctx, guild_id).await;
            output.push_str(&name);
            output.push(' ');
        }
        output.push('\n');

        output.push_str(&BOT_EMOJI.lock().unwrap());
        for player in self.bot.iter() {
            let name = get_name(player, &ctx, guild_id).await;
            output.push_str(&name);
            output.push(' ');
        }
        output.push('\n');

        output.push_str(&SUP_EMOJI.lock().unwrap());
        for player in self.support.iter() {
            let name = get_name(player, &ctx, guild_id).await;
            output.push_str(&name);
            output.push(' ');
        }
        output.push('\n');
        output
    }

    pub async fn remove_game(
        &mut self,
        game_id: &i32,
        afk_players: &HashSet<UserId>,
        ctx: &Context,
        queue_id: ChannelId,
    ) {
        let game = self.tentative_games.iter().find(|game| game.id == *game_id);
        if game.is_none() {
            return;
        }
        match game {
            Some(game) => {
                let mut team1 = game.team(0).clone();
                let mut team2 = game.team(1).clone();
                team1.retain(|player| !afk_players.contains(&player.0));
                team2.retain(|player| !afk_players.contains(&player.0));
                for player in team1.iter().merge(team2.iter()) {
                    match player.1 {
                        0 => self.top.push_front(player.0),
                        1 => self.jungle.push_front(player.0),
                        2 => self.mid.push_front(player.0),
                        3 => self.bot.push_front(player.0),
                        4 => self.support.push_front(player.0),
                        _ => panic!("Invalid role"),
                    }
                }
                let game_index = self
                    .tentative_games
                    .iter()
                    .position(|game| game.id == *game_id);
                if let Some(game_index) = game_index {
                    let game_message = self.tentative_games.swap_remove(game_index).message_id;
                    //delte message
                    let _ = ctx
                        .http
                        .delete_message(u64::from(queue_id), u64::from(game_message))
                        .await;
                }
            }
            None => {
                return;
            }
        }
    }
}

#[derive(PartialEq, Debug)]
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
pub async fn get_msl_points(
    opggs: Vec<(String, String, i32)>,
    riot_key: &str,
) -> Result<f64, &'static str> {
    let mut accounts: Vec<AccountInfo> = Vec::new();
    for (opgg, id, level) in opggs {
        let mut rank2021 = Rank {
            tier: String::new(),
            division: String::new(),
            lp: String::new(),
            error: false,
        };
        let mut rank2020 = Rank {
            tier: String::new(),
            division: String::new(),
            lp: String::new(),
            error: false,
        };
        if let Ok(response) = reqwest::get(&format!("https://na.op.gg/summoners/na/{}", opgg)).await
        {
            let doc = Html::parse_document(&response.text().await.unwrap());
            let content = doc
                .select(&Selector::parse("#__NEXT_DATA__").unwrap())
                .next()
                .unwrap();
            let json: Value = serde_json::from_str(&content.inner_html()).unwrap();
            let mut lastseason = false;
            if let Some(season) =
                json["props"]["pageProps"]["data"]["previous_seasons"][0]["season_id"].as_i64()
            {
                if season == 17 {
                    lastseason = true
                }
            } else {
                lastseason = false;
            }
            let mut lastseason2 = false;
            if let Some(season) =
                json["props"]["pageProps"]["data"]["previous_seasons"][1]["season_id"].as_i64()
            {
                if season == 15 {
                    lastseason2 = true;
                }
            } else {
                lastseason2 = false;
            }
            if lastseason {
                if let Some(rank) = json["props"]["pageProps"]["data"]["previous_seasons"][0]
                    ["tier_info"]["tier"]
                    .as_str()
                {
                    rank2021.tier = rank.to_string();
                } else {
                    rank2021.error = true;
                }
                if let Some(division) = json["props"]["pageProps"]["data"]["previous_seasons"][0]
                    ["tier_info"]["division"]
                    .as_i64()
                {
                    rank2021.division = division.to_string();
                } else {
                    rank2021.error = true;
                }
                let test =
                    &json["props"]["pageProps"]["data"]["previous_seasons"][0]["tier_info"]["lp"];
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
                if let Some(rank) = json["props"]["pageProps"]["data"]["previous_seasons"][1]
                    ["tier_info"]["tier"]
                    .as_str()
                {
                    rank2020.tier = rank.to_string();
                } else {
                    rank2020.error = true;
                }
                if let Some(division) = json["props"]["pageProps"]["data"]["previous_seasons"][1]
                    ["tier_info"]["division"]
                    .as_i64()
                {
                    rank2020.division = division.to_string();
                } else {
                    rank2020.error = true;
                }
                let test =
                    &json["props"]["pageProps"]["data"]["previous_seasons"][1]["tier_info"]["lp"];
                if test.is_i64() {
                    rank2020.lp = test.as_i64().unwrap().to_string();
                } else if test.is_null() {
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
                winrate = format!(
                    "{}%",
                    (entry.wins as f32 / (entry.wins + entry.losses) as f32 * 100.0) as i64
                );
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
        let account = AccountInfo {
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
    let a: f32 = 4.0 / 57600.0;
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
        dbg!("{:?}", &account);
        if account.account_level > account_level_max {
            account_level_max = account.account_level;
        }
        if !account.rank2020.error {
            lp_points = account.rank2020.lp.parse::<i32>().unwrap() / 100;
            let rank = &format!(
                "{} {}",
                account.rank2020.tier.to_uppercase(),
                account.rank2020.division
            );
            for (i, table_rank) in RANKPOINTTABLE.iter().enumerate() {
                if table_rank.0 == rank {
                    ranked_points = RANKPOINTTABLE[i].1 as i32;
                    ranked_point_index = i;
                    break;
                }
            }
            if ranked_point_index == 0 {
                ranked_point_index = 1;
            }
            lp_points *= RANKPOINTTABLE[ranked_point_index - 1].1 as i32 - ranked_points;
            if ranked_points < 40 {
                ranked_points += lp_points;
            }
            if ranked_points > s2020_max {
                s2020_max = ranked_points;
            }
        }
        if !account.rank2021.error {
            lp_points = account.rank2021.lp.parse::<i32>().unwrap() / 100;
            let rank = &format!(
                "{} {}",
                account.rank2021.tier.to_uppercase(),
                account.rank2021.division
            );
            for (i, table_rank) in RANKPOINTTABLE.iter().enumerate() {
                if table_rank.0 == rank {
                    ranked_points = RANKPOINTTABLE[i].1 as i32;
                    ranked_point_index = i;
                    break;
                }
            }
            if rank == "CHALLENGER 1" {
                ranked_point_index = 1;
            }
            lp_points *= RANKPOINTTABLE[ranked_point_index - 1].1 as i32 - ranked_points;
            if ranked_points < 40 {
                ranked_points += lp_points;
            }
            if ranked_points > s2021_max {
                s2021_max = ranked_points;
            }
        }
        if account.current_rank != "N/A" {
            lp_points = account.current_rank_lp.parse::<i32>().unwrap() / 100;
            let rank = &account.current_rank;
            for (i, table_rank) in RANKPOINTTABLE.iter().enumerate() {
                if table_rank.0 == rank {
                    ranked_points = RANKPOINTTABLE[i].1 as i32;
                    ranked_point_index = i;
                    break;
                }
            }
            if rank == "CHALLENGER 1" {
                ranked_point_index = 1;
            }
            lp_points *= RANKPOINTTABLE[ranked_point_index - 1].1 as i32 - ranked_points;
            if ranked_points < 40 {
                ranked_points += lp_points;
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
        for (i, table_rank) in RANKPOINTTABLE.iter().enumerate() {
            if table_rank.0 == rank {
                ranked_points = RANKPOINTTABLE[i].1 as i32;
                ranked_point_index = i;
                break;
            }
        }
        if rank == "CHALLENGER 1" {
            ranked_point_index = 1;
        }
        lp_points *= RANKPOINTTABLE[ranked_point_index - 1].1 as i32 - ranked_points;
        if account.number_of_games.parse::<i64>().unwrap() > 300 {
            account.number_of_games = 300.to_string();
        } else if account.number_of_games.parse::<i64>().unwrap() < 30 {
            account.number_of_games = 30.to_string();
        }
        let game_played_points =
            (a * f32::powi(account.number_of_games.parse::<f32>().unwrap(), 2)
                + b * account.number_of_games.parse::<f32>().unwrap()
                + c)
                / 2.0;
        if ranked_points >= 40 {
            ranked_points += game_played_points as i32;
        } else {
            ranked_points = ranked_points + lp_points + game_played_points as i32;
        }
        current_rank_points = ranked_points;
    }
    let account_level_points =
        a * f32::powi(account_level_max as f32, 2) + b * account_level_max as f32 + c;
    let player = [s2020_max, s2021_max, current_rank_max, current_rank_points];
    let mut player_points = 0;
    for points in &player {
        if points > &player_points {
            player_points = *points;
        }
    }
    player_points += account_level_points as i32;
    if player_points > 45 {
        player_points = 45;
    }
    Ok(player_points.into())
}

async fn get_name(player: &UserId, ctx: &Context, guild_id: GuildId) -> String {
    let name = if player == &0
        || player == &1
        || player == &2
        || player == &3
        || player == &4
        || player == &5
        || player == &6
        || player == &7
        || player == &8
        || player == &9
    {
        format!("Unknown {}", player)
    } else {
        player.to_user(&ctx.http).await.unwrap().name
    };
    // let username = player.to_user(&ctx.http).await.unwrap().name;
    // let name = player
    //             .to_user(&ctx.http)
    //             .await
    //             .unwrap()
    //             .nick_in(&ctx.http, guild_id)
    //             .await
    //             .unwrap_or(username);
    name
}
