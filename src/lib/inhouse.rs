use std::collections::HashMap;
use serenity::model::id::UserId;
use serenity::prelude::Context;

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
    pub riot_accounts: Vec<String>,
    pub queued: Vec<String>,
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

    pub fn register_player(&mut self, discord_id: UserId) -> Result<(), &str>{
        if self.players.contains_key(&discord_id){
            return Err("Player already registered");
        }
        let player = Player{
            riot_accounts: Vec::new(),
            queued: Vec::new(),
        };
        self.players.insert(discord_id, player);
        //TODO save player to database
        Ok(())
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

    //TODO correct some logic with storing player queue in two locations, might be better to just store it in one but i duuno check it time profiler
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
        //TODO allow for customization of emoji for roles
        let mut output = String::new();

        output.push_str("<:DEMON1:986612626790428722> ");
        for player in self.top.iter(){
            let name = player.to_user(&ctx.http).await.unwrap().name;
            output.push_str(&name);
            output.push_str(" ");
        }
        output.push_str("\n");

        output.push_str(":dog: ");
        for player in self.jungle.iter(){
            let name = player.to_user(&ctx.http).await.unwrap().name;
            output.push_str(&name);
            output.push_str(" ");
        }
        output.push_str("\n");

        output.push_str(":cat: ");
        for player in self.mid.iter(){
            let name = player.to_user(&ctx.http).await.unwrap().name;
            output.push_str(&name);
            output.push_str(" ");
        }
        output.push_str("\n");

        output.push_str(":blue_car: ");
        for player in self.bot.iter(){
            let name = player.to_user(&ctx.http).await.unwrap().name;
            output.push_str(&name);
            output.push_str(" ");
        }
        output.push_str("\n");

        output.push_str(":police_car: ");
        for player in self.support.iter(){
            let name = player.to_user(&ctx.http).await.unwrap().name;
            output.push_str(&name);
            output.push_str(" ");
        }
        output.push_str("\n");
        output
    }
}