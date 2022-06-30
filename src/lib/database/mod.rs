pub mod models;
pub mod schema;

use diesel::r2d2::{ConnectionManager, Pool};
use diesel::prelude::*;
use std::env;

use super::inhouse::Player;
use serenity::model::id::UserId;

use self::models::{NewPlayer, NewPlayerRatings};

pub type PgPool = Pool<ConnectionManager<PgConnection>>;

pub struct Values {
    pub db_connection: PgPool,
}

pub fn establish_connection() -> PgPool {
    let database_url = env::var("DATABASE_URL").expect("Expected to find a database url in the environment");
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    Pool::new(manager).expect("Failed to create pool.")
}

pub fn save_player(conn: &PgConnection, discord_id: &UserId, player_info: &Player) {
    use schema::{player,player_ratings};

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