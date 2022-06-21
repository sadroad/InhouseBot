use serenity::framework::standard::{CommandResult, macros::command};
use serenity::model::prelude::*;
use serenity::prelude::*;
use tokio::time::{sleep, Duration};
use crate::{QueueManager};

#[command]
pub async fn ping(ctx: &Context, msg: &Message) -> CommandResult {
    msg.channel_id.say(&ctx.http, "Pong!").await?;
    Ok(())
}

#[command]
pub async fn register(ctx: &Context, msg: &Message) -> CommandResult {
    {
        let data = ctx.data.write().await;
        let queue = data.get::<QueueManager>().unwrap();
        let mut queue = queue.lock().await;
        let player = msg.author.id;
        if let Err(e) = queue.register_player(player){
            let response = msg.reply_mention(&ctx.http, &format!("Error: {}", e)).await?;
            sleep(Duration::from_secs(3)).await;
            response.delete(&ctx.http).await?;
        }
    }
    msg.delete(&ctx.http).await?;
    Ok(())
}