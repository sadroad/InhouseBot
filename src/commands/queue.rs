use crate::lib::inhouse::*;
use crate::{Prefix, QueueChannel, QueueEmbed};

use serenity::framework::standard::{macros::command, Args, CommandResult};
use serenity::model::id::MessageId;
use serenity::model::prelude::*;
use serenity::prelude::*;
use tokio::time::{sleep, Duration};

use tracing::log::info;

#[command]
pub async fn queue(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    if check_queue_channel(ctx, msg).await {
        if args.len() != 1 {
            let prefix;
            {
                let data = ctx.data.read().await;
                prefix = data.get::<Prefix>().unwrap().clone();
            }
            let response = msg
                .reply_mention(&ctx.http, &format!("Usage: {}queue <role>", prefix))
                .await?;
            sleep(Duration::from_secs(3)).await;
            response.delete(&ctx.http).await?;
        } else {
            let role = args.single::<String>().unwrap();
            {
                let data = ctx.data.write().await;
                let queue = data.get::<QueueManager>().unwrap();
                let mut queue = queue.lock().await;
                let player = msg.author.id;
                if let Err(e) = queue.queue_player(player, &role) {
                    let response = msg
                        .reply_mention(&ctx.http, &format!("Error: {}", e))
                        .await?;
                    sleep(Duration::from_secs(3)).await;
                    response.delete(&ctx.http).await?;
                }
            }
            display(ctx, msg.guild_id.unwrap()).await;
        }
    }
    msg.delete(&ctx.http).await?;
    Ok(())
}

#[command]
pub async fn leave(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    if check_queue_channel(ctx, msg).await {
        if args.len() > 1 {
            let prefix;
            {
                let data = ctx.data.read().await;
                prefix = data.get::<Prefix>().unwrap().clone();
            }
            let response = msg
                .reply_mention(&ctx.http, &format!("Usage: {}leave <role?>", prefix))
                .await?;
            sleep(Duration::from_secs(3)).await;
            response.delete(&ctx.http).await?;
        } else {
            let role = if args.len() == 1 {
                args.single::<String>().unwrap()
            } else {
                "".to_string()
            };
            {
                let data = ctx.data.write().await;
                let queue = data.get::<QueueManager>().unwrap();
                let mut queue = queue.lock().await;
                if let Err(e) = queue.leave_queue(msg.author.id, &role) {
                    let response = msg
                        .reply_mention(&ctx.http, &format!("Error: {}", e))
                        .await?;
                    sleep(Duration::from_secs(3)).await;
                    response.delete(&ctx.http).await?;
                }
            }
            display(ctx, msg.guild_id.unwrap()).await;
        }
    }
    Ok(())
}

pub async fn display(ctx: &Context, guild_id: GuildId) {
    info!("Dispalyed");
    let prefix;
    let body;
    let num_players;
    let missing_roles;
    let queue_channel;
    {
        let data = ctx.data.read().await;
        let queue = data.get::<QueueManager>().unwrap();
        let mut queue = queue.lock().await;
        queue_channel = *data.get::<QueueChannel>().unwrap();
        if let Some(missing) = queue.check_for_game().await {
            missing_roles = missing;
        } else {
            missing_roles = String::from("A test string");
        }
        body = queue.display(ctx, guild_id).await;
        num_players = queue.number_of_unique_players().await;
        prefix = data.get::<Prefix>().unwrap().clone();
    }
    if queue_channel != ChannelId(0) {
        show_games(ctx, guild_id).await;
        {
            let mut data = ctx.data.write().await;
            let queue = data.get_mut::<QueueEmbed>().unwrap();
            if *queue == MessageId(0) {
                let response = queue_channel
                    .send_message(&ctx.http, |m| {
                        m.embed(|e| {
                            e.field("Queue", body, true)
                            .footer(|f| f.text(&format!("Use {}queue <role> to join or {}leave <role?> to leave | All non-queue messages are deleted", prefix, prefix)))
                        })
                }).await.unwrap();
                let response = response.id;
                *queue = response;
            } else if missing_roles != *"A test string" {
                queue_channel
                .edit_message(&ctx.http, *queue, |m| {
                    m.embed(|e| {
                        e.field("Queue", body,false)
                        .field("Missing Roles", missing_roles, false)
                        .field("# of Unique Players", num_players.to_string(), false)
                        .footer(|f| f.text(&format!("Use {}queue <role> to join or {}leave <role?> to leave | All non-queue messages are deleted", prefix, prefix)))
                    })
                }).await.unwrap();
            } else {
                queue_channel
                .edit_message(&ctx, *queue, |m| {
                    m.embed(|e| {
                        e.field("Queue", body,false)
                        .field("# of Unique Players", num_players.to_string(), false)
                        .footer(|f| f.text(&format!("Use {}queue <role> to join or {}leave <role?> to leave | All non-queue messages are deleted", prefix, prefix)))
                    })
                }).await.unwrap();
            }
        }
    }
    info!("Done");
}

async fn show_games(ctx: &Context, guild_id: GuildId) {
    let games;
    let queue_channel;
    {
        let data = ctx.data.read().await;
        let queue = data.get::<QueueManager>().unwrap().lock().await;
        games = queue.tentative_games.clone();
        queue_channel = *data.get::<QueueChannel>().unwrap();
    }
    if !games.is_empty() {
        info!("Sending message");
        for mut game in games {
            if game.displayed {
                continue;
            }
            let body = game.display(ctx, guild_id).await;
            if game.message_id == MessageId(0) {
                let response = queue_channel
                    .send_message(&ctx.http, |m| {
                        m.embed(|e| {
                            e.title("📢 Game found 📢")
                            .description(&format!("Blue side expected winrate is {}\nIf you are ready to play, press ✅\nIf you cannot play, press ❌\nThe queue will timeout after a few minutes and AFK players will be automatically dropped from queue", game.expected_winrate))
                            .field("BLUE", body.0, true)
                            .field("RED", body.1, true)
                        })
                }).await.unwrap();
                game.message_id = response.id;
            } else {
                queue_channel
                    .edit_message(&ctx.http, game.message_id, |m| {
                        m.embed(|e| e.field("BLUE", "test", true).field("RED", "te", true))
                    })
                    .await
                    .unwrap();
            }
        }
    }
}

async fn check_queue_channel(ctx: &Context, msg: &Message) -> bool {
    {
        let data = ctx.data.read().await;
        let channel_id = data.get::<QueueChannel>().unwrap();
        if channel_id != &msg.channel_id {
            return false;
        }
    }
    true
}
