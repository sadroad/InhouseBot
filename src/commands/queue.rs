use crate::{Prefix, QueueEmbed,QueueChannel};
use crate::lib::inhouse::*;

use serenity::framework::standard::{Args, CommandResult, macros::command};
use tokio::time::{sleep, Duration};
use serenity::model::id::{MessageId};
use serenity::model::prelude::*;
use serenity::prelude::*;

#[command]
pub async fn queue(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    if check_queue_channel(ctx, msg).await {
        if args.len() != 1 {
            let prefix;
            {
                let data = ctx.data.read().await;
                prefix = data.get::<Prefix>().unwrap().clone();
            }
            let response = msg.reply_mention(&ctx.http, &format!("Usage: {}queue <role>", prefix)).await?;
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
                    let response = msg.reply_mention(&ctx.http, &format!("Error: {}", e)).await?;
                    sleep(Duration::from_secs(3)).await;
                    response.delete(&ctx.http).await?;
                }
            }
            display(ctx,msg).await;
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
            let response = msg.reply_mention(&ctx.http, &format!("Usage: {}leave <role?>", prefix)).await?;
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
                    let response = msg.reply_mention(&ctx.http, &format!("Error: {}", e)).await?;
                    sleep(Duration::from_secs(3)).await;
                    response.delete(&ctx.http).await?;
                }
            }
            display(ctx,msg).await;
        }
    }
    Ok(())
}

pub async fn display(ctx: &Context, msg: &Message){
    let prefix;
    {
        let data = ctx.data.read().await;
        prefix = data.get::<Prefix>().unwrap().clone();
    }
    let body;
    let num_players;
    let missing_roles;
    {
        let data = ctx.data.read().await;
        let queue = data.get::<QueueManager>().unwrap();
        let mut queue = queue.lock().await;
        body = queue.display(ctx,msg.guild_id.unwrap()).await;
        num_players = queue.number_of_unique_players().await;
        if let Some(missing) = queue.check_for_game().await{
            missing_roles = missing;
        } else {
            missing_roles = String::from("A test string");
        }
    }
    {
        let mut data = ctx.data.write().await;
        let queue = data.get_mut::<QueueEmbed>().unwrap();
        if *queue == MessageId(0) {
            let response = msg
                .channel_id
                .send_message(&ctx.http, |m| {
                    m.embed(|e| {
                        e.field("Queue", body, true)
                        .footer(|f| f.text(&format!("Use {}queue <role> to join or {}leave to leave | All non-queue messages are deleted", prefix, prefix)))
                    })
            }).await.unwrap();
            let response = response.id;
            *queue = response;
        } else if missing_roles != String::from("A test string") {
            msg
            .channel_id
            .edit_message(&ctx.http, *queue, |m| {
                m.embed(|e| {
                    e.field("Queue", body,false)
                    .field("Missing Roles", missing_roles, false)
                    .field("# of Unique Players", num_players.to_string(), false)
                    .footer(|f| f.text(&format!("Use {}queue <role> to join or {}leave to leave | All non-queue messages are deleted", prefix, prefix)))
                })
            }).await.unwrap();
        } else {
            msg
            .channel_id
            .edit_message(&ctx, *queue, |m| {
                m.embed(|e| {
                    e.field("Queue", body,false)
                    .field("# of Unique Players", num_players.to_string(), false)
                    .footer(|f| f.text(&format!("Use {}queue <role> to join or {}leave to leave | All non-queue messages are deleted", prefix, prefix)))
                })
            }).await.unwrap();
        }
    }
}

async fn check_queue_channel(ctx: &Context, msg: &Message) -> bool{
    {
        let data = ctx.data.read().await;
        let channel_id = data.get::<QueueChannel>().unwrap();
        if channel_id != &msg.channel_id {
            return false;
        }
    }
    return true;
}
