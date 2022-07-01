//TODO enable proper caching for the entire bot, look at serenity's cache options
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;

mod commands;
mod lib;

use crate::commands::admin::*;
use crate::commands::meta::*;
use crate::commands::queue::*;
use crate::lib::database::*;
use crate::lib::inhouse::*;

use std::env;
use std::sync::Arc;

use serenity::async_trait;
use serenity::client::bridge::gateway::ShardManager;
use serenity::framework::standard::macros::group;
use serenity::framework::StandardFramework;
use serenity::model::channel::Message;
use serenity::model::gateway::Ready;
use serenity::model::id::{ChannelId, MessageId};
use serenity::prelude::*;
use tokio::time::{sleep, Duration};

use lazy_static::lazy_static;

use tracing::{error, info};

lazy_static! {
    pub static ref DBCONNECTION: Values = {
        Values {
            db_connection: establish_connection(),
        }
    };
    pub static ref LOADING_EMOJI: String =
        env::var("LOADING_EMOJI").unwrap_or_else(|_| "🔍".to_string());
}

pub struct ShardManagerContainer;

impl TypeMapKey for ShardManagerContainer {
    type Value = Arc<Mutex<ShardManager>>;
}
pub struct Prefix;

impl TypeMapKey for Prefix {
    type Value = String;
}

impl TypeMapKey for QueueManager {
    type Value = Arc<Mutex<QueueManager>>;
}

pub struct QueueEmbed;

impl TypeMapKey for QueueEmbed {
    type Value = MessageId;
}

pub struct QueueChannel;

impl TypeMapKey for QueueChannel {
    type Value = ChannelId;
}

pub struct Riot;

impl TypeMapKey for Riot {
    type Value = String;
}

struct Handler;

#[async_trait]
impl EventHandler for Handler {
    async fn ready(&self, ctx: Context, ready: Ready) {
        info!("Connected as {}", ready.user.name);
        if !ready.guilds.is_empty() {
            display(&ctx, ready.guilds[0].id).await;
        }
    }

    async fn message(&self, ctx: Context, msg: Message) {
        info!(
            "Received a message from {}: {}",
            msg.author.name, msg.content
        );
        let channel_id;
        let prefix: String;
        {
            let data = ctx.data.read().await;
            channel_id = *data.get::<QueueChannel>().unwrap();
            prefix = data.get::<Prefix>().unwrap().clone();
        }
        if msg.channel_id == channel_id && !msg.author.bot {
            if msg.content.starts_with(&format!("{}admin", prefix)) {
                let mut args = msg.content.split_whitespace();
                args.next();
                let command = args.next().unwrap();
                match command {
                    "unmark" => {
                        return;
                    }
                    "mark" => {
                        return;
                    }
                    _ => {
                        let resp = msg
                            .reply_mention(
                                &ctx.http,
                                "Don't use that command in the queue channel :P",
                            )
                            .await
                            .unwrap();
                        sleep(Duration::from_secs(1)).await;
                        resp.delete(&ctx.http).await.unwrap();
                        msg.delete(&ctx.http).await.unwrap();
                    }
                }
            } else {
                msg.delete(&ctx.http).await.unwrap();
            }
        }
    }
}

#[group]
#[commands(ping, queue, leave, register)]
struct General;

#[group]
#[commands(mark, unmark, role_emojis, test)]
#[prefix("admin")]
#[required_permissions("ADMINISTRATOR")]
struct Admin;

//Ignore the following error, rust-analyzer is causing a false positive
#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    let token =
        env::var("DISCORD_TOKEN").expect("Expected to find a discord token in the environment");

    let prefix = env::var("PREFIX").unwrap_or_else(|_| "!".to_string());

    let riot_key = env::var("RGAPI_KEY").expect("Expect to find a riot api key in the environment");

    let manager = QueueManager::new();

    let framework = StandardFramework::new()
        .configure(|c| c.prefix(&prefix))
        .group(&GENERAL_GROUP)
        .group(&ADMIN_GROUP);

    let intents = GatewayIntents::non_privileged()
        | GatewayIntents::MESSAGE_CONTENT
        | GatewayIntents::DIRECT_MESSAGES;

    let mut client = Client::builder(&token, intents)
        .framework(framework)
        .event_handler(Handler)
        .await
        .expect("Error creating client");

    let queue_channel = init_server_info(
        &DBCONNECTION.db_connection.get().unwrap(),
        &client.cache_and_http.http,
    )
    .await;

    {
        let mut data = client.data.write().await;
        data.insert::<ShardManagerContainer>(client.shard_manager.clone());
        data.insert::<Prefix>(prefix);
        data.insert::<QueueManager>(Arc::new(Mutex::new(manager)));
        data.insert::<QueueChannel>(queue_channel);
        data.insert::<QueueEmbed>(MessageId(0));
        data.insert::<Riot>(riot_key);
    }

    let shard_manager = client.shard_manager.clone();

    tokio::spawn(async move {
        tokio::signal::ctrl_c()
            .await
            .expect("Error awaiting CTRL+C");
        info!("CTRL+C received; shutting down...");
        shard_manager.lock().await.shutdown_all().await;
    });

    if let Err(why) = client.start().await {
        error!("Error starting client: {:?}", why);
    }
}
