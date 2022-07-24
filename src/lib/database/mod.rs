pub mod models;
pub mod schema;

use diesel::prelude::*;
use diesel::r2d2::{ConnectionManager, Pool};
use std::env;

use diesel_migrations::embed_migrations;

use crate::commands::admin::clear_channel;

use super::inhouse::{Game, Player, BOT_EMOJI, JG_EMOJI, MID_EMOJI, SUP_EMOJI, TOP_EMOJI};
use super::openskill::lib::Rating;
use serenity::http::Http;
use serenity::model::id::{ChannelId, UserId};

use rayon::prelude::*;

use std::sync::Arc;

use self::models::*;

pub type PgPool = Pool<ConnectionManager<PgConnection>>;

pub struct Values {
    pub db_connection: PgPool,
}
embed_migrations!();
pub fn establish_connection() -> PgPool {
    let database_url =
        env::var("DATABASE_URL").expect("Expected to find a database url in the environment");
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    let pool = Pool::new(manager).expect("Failed to create pool.");
    let conn = pool.get().expect("Failed to get connection from pool.");
    embedded_migrations::run(&conn).unwrap();
    pool
}

pub fn save_player(conn: &PgConnection, discord_id: &UserId, player_info: &Player) {
    use schema::{player, player_ratings};

    let new_player = NewPlayer {
        discord_id: *discord_id.as_u64() as i64,
        accounts: player_info.riot_accounts.clone(),
    };

    let new_player_ratings = NewPlayerRatings {
        discord_id: *discord_id.as_u64() as i64,
        mu: player_info.rating.mu,
        sigma: player_info.rating.sigma,
    };

    diesel::insert_into(player::table)
        .values(&new_player)
        .execute(conn)
        .expect("Error saving new player");

    diesel::insert_into(player_ratings::table)
        .values(&new_player_ratings)
        .execute(conn)
        .expect("Error saving new player ratings");
}

pub fn remove_player(conn: &PgConnection, discord_id: &UserId) {
    use schema::{game_roles, player, player_ratings};

    diesel::delete(player_ratings::table)
        .filter(player_ratings::discord_id.eq(*discord_id.as_u64() as i64))
        .execute(conn)
        .expect("Error deleting player ratings");
    diesel::delete(game_roles::table)
        .filter(game_roles::discord_id.eq(*discord_id.as_u64() as i64))
        .execute(conn)
        .expect("Error deleting game roles");
    diesel::delete(player::table)
        .filter(player::discord_id.eq(*discord_id.as_u64() as i64))
        .execute(conn)
        .expect("Error deleting player");
}

pub fn get_players(conn: &PgConnection) -> Vec<(UserId, Player)> {
    use schema::{player, player_ratings};

    let players = player::table
        .load::<DbPlayer>(conn)
        .expect("Error loading players");

    let mut return_players: Vec<(UserId, Player)> = Vec::new();
    for player in players {
        let player_ratings = player_ratings::table
            .filter(player_ratings::discord_id.eq(player.discord_id))
            .first::<PlayerRatings>(conn)
            .expect("Error loading player ratings");
        let discord_id = UserId::from(player.discord_id as u64);
        let player_info = Player {
            riot_accounts: player.accounts.clone(),
            queued: Vec::new(),
            rating: Rating::from(discord_id, player_ratings.mu, player_ratings.sigma),
        };
        return_players.push((discord_id, player_info));
    }
    return_players
}

pub async fn init_server_info(conn: &PgConnection, ctx: &Arc<Http>) -> ChannelId {
    use schema::server_information;

    //check if server_information table is empty
    let server_info = server_information::table
        .load::<ServerInformation>(conn)
        .expect("Error loading server information");
    if server_info.is_empty() {
        let new_server_information = NewServerInformation {
            queue_channel: 0,
            command_channel: 0,
            top_emoji: TOP_EMOJI.lock().unwrap().to_string(),
            jungle_emoji: JG_EMOJI.lock().unwrap().to_string(),
            mid_emoji: MID_EMOJI.lock().unwrap().to_string(),
            bot_emoji: BOT_EMOJI.lock().unwrap().to_string(),
            sup_emoji: SUP_EMOJI.lock().unwrap().to_string(),
        };

        diesel::insert_into(server_information::table)
            .values(&new_server_information)
            .execute(conn)
            .expect("Error saving new server information");
        ChannelId(0)
    } else {
        let server_info = server_info.first().unwrap();
        let queue_channel = ChannelId::from(server_info.queue_channel as u64);
        clear_channel(ctx, queue_channel).await;
        *TOP_EMOJI.lock().unwrap() = server_info.top_emoji.clone();
        *JG_EMOJI.lock().unwrap() = server_info.jungle_emoji.clone();
        *MID_EMOJI.lock().unwrap() = server_info.mid_emoji.clone();
        *BOT_EMOJI.lock().unwrap() = server_info.bot_emoji.clone();
        *SUP_EMOJI.lock().unwrap() = server_info.sup_emoji.clone();
        queue_channel
    }
}

pub fn update_emoji(conn: &PgConnection, emojis: [&str; 5]) {
    use schema::server_information;

    diesel::update(server_information::table.find(1))
        .set((
            server_information::top_emoji.eq(emojis[0].to_string()),
            server_information::jungle_emoji.eq(emojis[1].to_string()),
            server_information::mid_emoji.eq(emojis[2].to_string()),
            server_information::bot_emoji.eq(emojis[3].to_string()),
            server_information::sup_emoji.eq(emojis[4].to_string()),
        ))
        .execute(conn)
        .expect("Error updating emoji");
}

pub fn update_queue_channel(conn: &PgConnection, channel: &ChannelId) {
    use schema::server_information;

    diesel::update(server_information::table.find(1))
        .set(server_information::queue_channel.eq(channel.0 as i64))
        .execute(conn)
        .expect("Error updating queue channel");
}

pub fn next_game_id(conn: &PgConnection) -> i32 {
    use schema::games;

    let games = games::table
        .load::<Games>(conn)
        .expect("Error loading games");

    if games.is_empty() {
        0
    } else {
        return games.last().unwrap().id + 1;
    }
}

pub fn update_rating(conn: &PgConnection, discord_id: &UserId, rating: &Rating) {
    use schema::player_ratings;

    diesel::update(player_ratings::table)
        .filter(player_ratings::discord_id.eq(*discord_id.as_u64() as i64))
        .set((
            player_ratings::mu.eq(rating.mu),
            player_ratings::sigma.eq(rating.sigma),
        ))
        .execute(conn)
        .expect("Error updating player ratings");
}

pub fn update_game(conn: &PgConnection, game: &Game, winner: bool) {
    use schema::game_roles;
    use schema::games;

    let blue = game.team(0);
    let blue_team = blue.iter();
    let red = game.team(1);
    let red_team = red.iter();
    let teams_merged: Vec<&(UserId, i8, i8)> = blue.iter().chain(red.iter()).collect();
    let mut new_game_roles: Vec<NewGameRoles> = Vec::new();
    for player in blue_team {
        new_game_roles.push(NewGameRoles {
            game_id: game.get_id(),
            discord_id: i64::from(player.0),
            role: {
                match player.1 {
                    0 => "top".to_string(),
                    1 => "jungle".to_string(),
                    2 => "mid".to_string(),
                    3 => "bot".to_string(),
                    4 => "sup".to_string(),
                    _ => "".to_string(),
                }
            },
            blue_side: true,
        });
    }
   for player in red_team {
        new_game_roles.push(NewGameRoles {
            game_id: game.get_id(),
            discord_id: i64::from(player.0),
            role: {
                match player.1 {
                    0 => "top".to_string(),
                    1 => "jungle".to_string(),
                    2 => "mid".to_string(),
                    3 => "bot".to_string(),
                    4 => "sup".to_string(),
                    _ => "".to_string(),
                }
            },
            blue_side: false,
        });
    }
    let new_game = NewGames {
        id: game.get_id(),
        winner,
        players: teams_merged.par_iter().map(|x| i64::from(x.0)).collect(),
    };
    diesel::insert_into(games::table)
        .values(&new_game)
        .execute(conn)
        .expect("Error saving new game");
    diesel::insert_into(game_roles::table)
        .values(&new_game_roles)
        .execute(conn)
        .expect("Error saving new game roles");
}
