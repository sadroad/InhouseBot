mod commands;
mod lib;

use crate::commands::meta::*;
use crate::commands::queue::*;
use crate::commands::admin::*;
use crate::lib::inhouse::*;

use std::env;
use dotenv;
use std::sync::Arc;

use serenity::async_trait;
use serenity::client::bridge::gateway::ShardManager;
use serenity::framework::standard::macros::group;
use serenity::framework::StandardFramework;
use serenity::model::channel::Message;
use serenity::model::gateway::Ready;
use serenity::model::id::{ChannelId,MessageId};
use serenity::prelude::*;

use tracing::{error, info};

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

struct Handler;

#[async_trait]
impl EventHandler for Handler {
    async fn ready(&self, _ctx: Context, ready: Ready) {
        info!("Connected as {}", ready.user.name);
    }

    async fn message(&self, ctx: Context, msg: Message) {
        info!("Received a message from {}: {}", msg.author.name, msg.content);
        let channel_id;
        let prefix: String;
        {
            let data = ctx.data.read().await;
            channel_id = data.get::<QueueChannel>().unwrap().clone();
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
                    },
                    "mark" => {
                        return;
                    },
                    _ => {
                        msg.delete(&ctx).await.unwrap();
                    }
                }
            } else {
                msg.delete(&ctx.http).await.unwrap();
            }
        }
    }
}

#[group]
#[commands(ping,queue,leave)]
struct General;

#[group]
#[commands(mark,unmark)]
#[prefix("admin")]
#[required_permissions("ADMINISTRATOR")]
struct Admin;

#[tokio::main]
async fn main() {
    dotenv::dotenv().expect("Failed to load .env file");
    tracing_subscriber::fmt::init();

    let token = env::var("DISCORD_TOKEN").expect("Expected to find a discord token in the environment");

    let prefix = env::var("PREFIX").unwrap_or_else(|_| "!".to_string());

    let manager = QueueManager::new();

    let framework = StandardFramework::new()
        .configure(|c| c.prefix(&prefix))
        .group(&GENERAL_GROUP)
        .group(&ADMIN_GROUP);

    let intents = GatewayIntents::non_privileged() | GatewayIntents::MESSAGE_CONTENT | GatewayIntents::DIRECT_MESSAGES;

    let mut client = Client::builder(&token, intents)
        .framework(framework)
        .event_handler(Handler)
        .await
        .expect("Error creating client");

    {
        let mut data = client.data.write().await;
        data.insert::<ShardManagerContainer>(client.shard_manager.clone());
        data.insert::<Prefix>(prefix);
        data.insert::<QueueManager>(Arc::new(Mutex::new(manager)));
        data.insert::<QueueChannel>(ChannelId(0));
        data.insert::<QueueEmbed>(MessageId(0));
    }

    let shard_manager = client.shard_manager.clone();

    tokio::spawn(async move {
        tokio::signal::ctrl_c().await.expect("Error awaiting CTRL+C");
        info!("CTRL+C received; shutting down...");
        shard_manager.lock().await.shutdown_all().await;
    });

    if let Err(why) = client.start().await {
        error!("Error starting client: {:?}", why);
    }
}
