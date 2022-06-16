use crate::Prefix;
use crate::lib::inhouse::*;

use serenity::framework::standard::{Args, CommandResult, macros::command};
use tokio::time::{sleep, Duration};
use serenity::model::prelude::*;
use serenity::prelude::*;

#[command]
pub async fn queue(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let prefix;
    {
        let data = ctx.data.read().await;
        prefix = data.get::<Prefix>().unwrap().clone();
    }
    if args.len() != 1 {
        let response = msg.reply_ping(&ctx.http, &format!("Usage: {}queue <role>", prefix)).await?;
        sleep(Duration::from_secs(3)).await;
        response.delete(&ctx.http).await?;
    } else {
        let role = args.single::<String>().unwrap();
        {
            let data = ctx.data.write().await;
            let queue = data.get::<QueueManager>().unwrap();
            let player = Player {
                discord_id: msg.author.id.to_string(),
                discord_name: msg.author.name.to_string(),
            };
            let mut queue = queue.lock().await;
            if let Err(e) = queue.queue_player(player, &role) {
                let response = msg.reply_ping(&ctx.http, &format!("Error: {}", e)).await?;
                sleep(Duration::from_secs(3)).await;
                response.delete(&ctx.http).await?;
            }
        }
        display(ctx,msg).await;
    }
    msg.delete(&ctx.http).await?;
    Ok(())
}

#[command]
pub async fn leave(ctx: &Context, msg: &Message) -> CommandResult {
    //TODO implement support for leaving specific role
    {
        let data = ctx.data.write().await;
        let queue = data.get::<QueueManager>().unwrap();
        let mut queue = queue.lock().await;
        if let Err(e) = queue.leave_queue(msg.author.id.to_string()) {
            let response = msg.reply_ping(&ctx.http, &format!("Error: {}", e)).await?;
            sleep(Duration::from_secs(3)).await;
            response.delete(&ctx.http).await?;
        }
    }
    display(ctx,msg).await;
    Ok(())
}

async fn display(ctx: &Context, msg: &Message){
    let prefix;
    {
        let data = ctx.data.read().await;
        prefix = data.get::<Prefix>().unwrap().clone();
    }
    let body;
    {
        let data = ctx.data.read().await;
        let queue = data.get::<QueueManager>().unwrap();
        let queue = queue.lock().await;
        body = queue.display();
    }
    let response = msg
        .channel_id
        .send_message(&ctx, |m| {
            m.embed(|e| {
                e.fields(vec![
                    ("Queue", body,true)
                ])
                .footer(|f| f.text(&format!("Use {}queue <role> to join or {}leave to leave | All non-queue messages are deleted", prefix, prefix)))
            })
    }).await.unwrap();
}