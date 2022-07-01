use super::schema::{player, player_ratings, server_information};

#[derive(Queryable)]
pub struct ServerInformation {
    pub id: i32,
    pub queue_channel: i64,
    pub command_channel: i64,
    pub top_emoji: String,
    pub jungle_emoji: String,
    pub mid_emoji: String,
    pub bot_emoji: String,
    pub sup_emoji: String,
}

#[derive(Insertable)]
#[table_name = "server_information"]
pub struct NewServerInformation {
    pub queue_channel: i64,
    pub command_channel: i64,
    pub top_emoji: String,
    pub jungle_emoji: String,
    pub mid_emoji: String,
    pub bot_emoji: String,
    pub sup_emoji: String,
}

#[derive(Queryable)]
pub struct DbPlayer {
    pub discord_id: i64,
    pub accounts: Vec<String>,
}

#[derive(Insertable)]
#[table_name = "player"]
pub struct NewPlayer {
    pub discord_id: i64,
    pub accounts: Vec<String>,
}

#[derive(Queryable)]
pub struct PlayerRatings {
    pub discord_id: i64,
    pub mu: f64,
    pub sigma: f64,
}

#[derive(Insertable)]
#[table_name = "player_ratings"]
pub struct NewPlayerRatings {
    pub discord_id: i64,
    pub mu: f64,
    pub sigma: f64,
}

#[derive(Queryable)]
pub struct GameRoles {
    pub id: i32,
    pub discord_id: i64,
    pub game_id: i32,
    pub role: String,
    pub blue_side: bool,
}

#[derive(Queryable)]
pub struct Games {
    pub id: i32,
    pub players: Vec<i64>,
}
