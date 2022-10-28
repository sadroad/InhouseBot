//TODO enable proper caching for the entire bot, look at serenity's cache options
//TODO look into the sharding feature of serenity, it's a good idea to have a shard for each guild but it seems to be lagging the bot by disconnecting from the guild
mod commands;
mod lib;

use crate::commands::admin::*;
use crate::commands::meta::*;
use crate::commands::queue::*;
use crate::lib::database::*;
use crate::lib::inhouse::*;

use std::collections::HashMap;
use std::env;
use std::sync::Arc;
use tokio::sync::RwLock;

use lazy_static::lazy_static;
use serenity::async_trait;
use serenity::builder::CreateApplicationCommandOption;
use serenity::client::bridge::gateway::ShardManager;
use serenity::framework::StandardFramework;
use serenity::model::application::interaction::Interaction;
use serenity::model::channel::Message;
use serenity::model::gateway::Ready;
use serenity::model::id::{ChannelId, MessageId};
use serenity::model::prelude::command::CommandOptionType;
use serenity::model::Permissions;
use serenity::prelude::*;

use tracing::{error, info};

lazy_static! {
    pub static ref DBCONNECTION: Values = {
        Values {
            db_connection: establish_connection(),
        }
    };
    pub static ref LOADING_EMOJI: String =
    //     env::var("LOADING_EMOJI").unwrap_or_else(|_| "🔍".to_string());
    String::from("<a:loading:992255705073602590>");
    pub static ref QUEUE_MANAGER: Arc<RwLock<QueueManager>> =
        Arc::new(RwLock::new(QueueManager::new()));
    pub static ref GAME_MANAGER: Arc<RwLock<GameManager>> =
        Arc::new(RwLock::new(GameManager::new()));
}

pub struct ShardManagerContainer;

impl TypeMapKey for ShardManagerContainer {
    type Value = Arc<Mutex<ShardManager>>;
}

pub struct QueueEmbed;

impl TypeMapKey for QueueEmbed {
    type Value = Arc<Mutex<MessageId>>;
}

pub struct QueueChannel;

impl TypeMapKey for QueueChannel {
    type Value = Arc<Mutex<ChannelId>>;
}

pub struct Riot;

impl TypeMapKey for Riot {
    type Value = String;
}

struct Handler;

#[async_trait]
impl EventHandler for Handler {
    async fn message(&self, ctx: Context, msg: Message) {
        info!(
            "Received a message from {}: {}",
            msg.author.name, msg.content
        );
        let channel_id;
        {
            let data = ctx.data.read().await;
            channel_id = *data.get::<QueueChannel>().unwrap().lock().await;
        }
        if msg.channel_id == channel_id && !msg.author.bot {
            msg.delete(&ctx.http).await.unwrap();
        }
    }

    async fn ready(&self, ctx: Context, ready: Ready) {
        info!("Connected as {}", ready.user.name);
        if !ready.guilds.is_empty() {
            let guild_id = ready.guilds[0].id;
            let commands = guild_id
                .set_application_commands(&ctx.http, |commands| {
                    commands
                        .create_application_command(|command| {
                            command.name("ping").description("A ping command.")
                        })
                        .create_application_command(|command| {
                            command
                                .name("register")
                                .description("Register yourself to use the queue")
                                .dm_permission(false)
                        })
                        .create_application_command(|command| {
                            command
                                .name("cancel")
                                .description("Cancel the current game you are in")
                                .dm_permission(false)
                        })
                        .create_application_command(|command| {
                            command
                                .name("won")
                                .description("Mark the current game winner as your team")
                                .dm_permission(false)
                        })
                        .create_application_command(|command| {
                            command
                                .name("clear")
                                .description("Create a vote to clear the queue")
                                .dm_permission(false)
                        })
                        .create_application_command(|command| {
                            command
                                .name("remove")
                                .description("Create a vote to remove a user")
                                .dm_permission(false)
                                .create_option(|option| {
                                    option
                                        .name("user")
                                        .description("The user to remove")
                                        .required(true)
                                        .kind(CommandOptionType::User)
                                })
                        })
                        .create_application_command(|command| {
                            command
                                .name("leave")
                                .description("Leave the queue")
                                .dm_permission(false)
                                .create_option(|option| {
                                    option
                                        .name("role")
                                        .description("The role to leave")
                                        .kind(CommandOptionType::String)
                                        .add_string_choice("Top", "top")
                                        .add_string_choice("Jungle", "jng")
                                        .add_string_choice("Middle", "mid")
                                        .add_string_choice("Bottom", "bot")
                                        .add_string_choice("Support", "sup")
                                })
                        })
                        .create_application_command(|command| {
                            command
                                .name("queue")
                                .description("Join the queue")
                                .dm_permission(false)
                                .create_option(|option| {
                                    option
                                        .name("role")
                                        .description("The role to join")
                                        .kind(CommandOptionType::String)
                                        .add_string_choice("Top", "top")
                                        .add_string_choice("Jungle", "jng")
                                        .add_string_choice("Middle", "mid")
                                        .add_string_choice("Bottom", "bot")
                                        .add_string_choice("Support", "sup")
                                })
                        })
                        .create_application_command(|command| {
                            command
                                .name("admin")
                                .description("Admin commands")
                                .dm_permission(false)
                                .default_member_permissions(Permissions::ADMINISTRATOR)
                                .create_option(|option| {
                                    option
                                        .name("remove")
                                        .description("Remove a user from the queue without a vote")
                                        .kind(CommandOptionType::SubCommand)
                                        .add_sub_option(
                                            CreateApplicationCommandOption(HashMap::new())
                                                .name("user")
                                                .description("The user to remove")
                                                .required(true)
                                                .kind(CommandOptionType::User)
                                                .to_owned(),
                                        )
                                })
                                .create_option(|option| {
                                    option
                                        .name("clear")
                                        .description("Clear the queue without a vote")
                                        .kind(CommandOptionType::SubCommand)
                                })
                                .create_option(|option| {
                                    option
                                        .name("test")
                                        .description("Add 10 test users to the queue")
                                        .kind(CommandOptionType::SubCommand)
                                })
                                .create_option(|option| {
                                    option
                                        .name("setemojis")
                                        .description("Change the emojis for the roles")
                                        .kind(CommandOptionType::SubCommand)
                                        .add_sub_option(
                                            CreateApplicationCommandOption(HashMap::new())
                                                .name("top")
                                                .description("The top role emoji")
                                                .required(true)
                                                .kind(CommandOptionType::String)
                                                .to_owned(),
                                        )
                                        .add_sub_option(
                                            CreateApplicationCommandOption(HashMap::new())
                                                .name("jng")
                                                .description("The jungle role emoji")
                                                .required(true)
                                                .kind(CommandOptionType::String)
                                                .to_owned(),
                                        )
                                        .add_sub_option(
                                            CreateApplicationCommandOption(HashMap::new())
                                                .name("mid")
                                                .description("The middle role emoji")
                                                .required(true)
                                                .kind(CommandOptionType::String)
                                                .to_owned(),
                                        )
                                        .add_sub_option(
                                            CreateApplicationCommandOption(HashMap::new())
                                                .name("bot")
                                                .description("The bottom role emoji")
                                                .required(true)
                                                .kind(CommandOptionType::String)
                                                .to_owned(),
                                        )
                                        .add_sub_option(
                                            CreateApplicationCommandOption(HashMap::new())
                                                .name("sup")
                                                .description("The support role emoji")
                                                .required(true)
                                                .kind(CommandOptionType::String)
                                                .to_owned(),
                                        )
                                })
                                .create_option(|option| {
                                    option
                                        .name("unmark")
                                        .description("Unmark the current channel as a queue")
                                        .kind(CommandOptionType::SubCommand)
                                })
                                .create_option(|option| {
                                    option
                                        .name("mark")
                                        .description("Mark the current channel as a queue")
                                        .kind(CommandOptionType::SubCommand)
                                })
                        })
                })
                .await;
            if let Err(e) = commands {
                error!("Error setting application commands: {}", e);
            }
            display(&ctx, guild_id).await;
        }
    }

    async fn interaction_create(&self, ctx: Context, interaction: Interaction) {
        if let Interaction::ApplicationCommand(command) = interaction {
            if let Err(e) = match command.data.name.as_str() {
                "queue" => queue(&ctx, &command).await,
                "leave" => leave(&ctx, &command).await,
                "register" => register(&ctx, &command).await,
                "won" => won(&ctx, &command).await,
                "cancel" => cancel(&ctx, &command).await,
                "remove" => vote_remove(&ctx, &command).await,
                "clear" => vote_clear(&ctx, &command).await,
                "admin" => {
                    let sub_command = command.data.options.get(0).unwrap();
                    match sub_command.name.as_str() {
                        "clear" => clear(&ctx, &command).await,
                        "remove" => remove(&ctx, &command, sub_command).await,
                        "setemojis" => role_emojis(&ctx, &command, sub_command).await,
                        "unmark" => unmark(&ctx, &command).await,
                        "mark" => mark(&ctx, &command).await,
                        "test" => test(&ctx, &command).await,
                        _ => {
                            error!("Unknown admin command: {}", sub_command.name);
                            Ok(())
                        }
                    }
                }
                "ping" => ping(&ctx, &command).await,
                _ => {
                    error!("Unknown command: {}", command.data.name);
                    Ok(())
                }
            } {
                error!("Error handling application command: {}", e);
            }
        }
    }
}

//Ignore the following error, rust-analyzer is causing a false positive
#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    let token =
        // env::var("DISCORD_TOKEN").expect("Expected to find a discord token in the environment");
        String::from("OTkyMjM1MDg0NzcyMDE2MjA4.GahxTv.FhA_l3bCyh-2Jv-MEg1CIKUW8fnT3whtdcUgO4");

    let riot_key = env::var("RGAPI_KEY").expect("Expect to find a riot api key in the environment");

    let framework = StandardFramework::new();

    let intents = GatewayIntents::non_privileged()
        | GatewayIntents::MESSAGE_CONTENT
        | GatewayIntents::DIRECT_MESSAGES;

    let mut client = Client::builder(&token, intents)
        .framework(framework)
        .event_handler(Handler)
        .await
        .expect("Error creating client");

    let queue_channel = init_server_info(
        &mut DBCONNECTION.db_connection.get().unwrap(),
        &client.cache_and_http.http,
    )
    .await;

    {
        let mut data = client.data.write().await;
        data.insert::<ShardManagerContainer>(client.shard_manager.clone());
        data.insert::<QueueChannel>(Arc::new(Mutex::new(queue_channel)));
        data.insert::<QueueEmbed>(Arc::new(Mutex::new(MessageId(0))));
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
