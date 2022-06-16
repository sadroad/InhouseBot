use std::collections::HashMap;

pub struct QueueManager{
    top: Vec<Player>,
    jungle: Vec<Player>,
    mid: Vec<Player>,
    bot: Vec<Player>,
    support: Vec<Player>,
    players: HashMap<String, Player>, //key: discord id, value: Player
    current_games: Vec<Game>,
}

pub struct Player{
    pub discord_id: String,
    pub discord_name: String,
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
    
    fn register_player(&mut self, discord_id: String, discord_name: String){
        //TODO write check to see if player already exists in database
        let player = Player{
            discord_id,
            discord_name,
        };
        let id = player.discord_id.clone();
        self.players.insert(id, player);
        //TODO save player to database
    }

    pub fn queue_player(&mut self, player: Player, role: &str) -> Result<(), &str> {
        //TODO check to see if player is already in no more than two roles or already in the same role
        match role {
            "top" => self.top.push(player),
            "jungle" => self.jungle.push(player),
            "mid" => self.mid.push(player),
            "bot" => self.bot.push(player),
            "support" => self.support.push(player),
            _ => return Err("Invalid role")
        }
        Ok(())
    }

    pub fn leave_queue(&mut self, discord_id: String) -> Result<(), &str> {
        //TODO allow for user to leave specfic role, not just all roles
        self.top.retain(|x| x.discord_id != discord_id);
        self.jungle.retain(|x| x.discord_id != discord_id);
        self.mid.retain(|x| x.discord_id != discord_id);
        self.bot.retain(|x| x.discord_id != discord_id);
        self.support.retain(|x| x.discord_id != discord_id);
        Ok(())
    }

    pub fn display(&self) -> String{
        //TODO allow for customization of emoji for roles
        let mut output = String::new();

        output.push_str("<:DEMON1:986612626790428722> ");
        for player in self.top.iter(){
            output.push_str(&player.discord_name);
            output.push_str(" ");
        }
        output.push_str("\n");

        output.push_str(":dog: ");
        for player in self.jungle.iter(){
            output.push_str(&player.discord_name);
            output.push_str(" ");
        }
        output.push_str("\n");

        output.push_str(":cat: ");
        for player in self.mid.iter(){
            output.push_str(&player.discord_name);
            output.push_str(" ");
        }
        output.push_str("\n");

        output.push_str(":blue_car: ");
        for player in self.bot.iter(){
            output.push_str(&player.discord_name);
            output.push_str(" ");
        }
        output.push_str("\n");

        output.push_str(":police_car: ");
        for player in self.support.iter(){
            output.push_str(&player.discord_name);
            output.push_str(" ");
        }
        output.push_str("\n");
        output
    }
}