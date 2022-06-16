use crate::{QueueChannel, Prefix};

use serenity::framework::standard::{CommandResult, macros::command};
use tokio::time::{sleep, Duration};
use serenity::model::prelude::*;
use serenity::prelude::*;

// TODO Add support for marking more channels as other types of channels (e.g. log channels) or for marking multiple queue channels for different mmr ranges
#[command]
async fn mark (ctx: &Context, msg: &Message) -> CommandResult {
    let channel_id;
    {
        let data = ctx.data.read().await;
        channel_id = data.get::<QueueChannel>().unwrap().clone();
    }
    if msg.channel_id != channel_id {
        if channel_id != ChannelId(0) {
            let prefix;
            {
                let data = ctx.data.read().await;
                prefix = data.get::<Prefix>().unwrap().clone();
            }
            let response = msg.reply_ping(&ctx.http, &format!("You must first unmark the prior queue channel. Use {}admin unmark", prefix)).await?;
            sleep(Duration::from_secs(3)).await;
            response.delete(&ctx.http).await?;
        } else {
            let react_msg = msg
                .reply(&ctx.http, "Confirm that you want to mark this channel as a queue channel, this will delete all messages currently in the channel. React with :white_check_mark: to confirm or :x: to cancel.")
                .await?;

            react_msg.react(&ctx.http, '✅').await?;
            react_msg.react(&ctx.http, '❌').await?;

            if let Some(reaction) = &react_msg
                .await_reaction(&ctx)
                .timeout(Duration::from_secs(60))
                .author_id(msg.author.id)
                .await
            {
                let emoji = &reaction.as_inner_ref().emoji;
                if emoji.as_data().as_str() == "✅" {
                    {
                        let mut data = ctx.data.write().await;
                        let queue_channel = data.get_mut::<QueueChannel>().unwrap();
                        *queue_channel = msg.channel_id;
                    }
                    let response = msg.reply_ping(&ctx.http, "Queue channel marked.").await?;
                    sleep(Duration::from_secs(3)).await;
                    response.delete(&ctx.http).await?;
                } else {
                    let response = msg.reply_ping(&ctx.http, "Cancelled.").await?;
                    sleep(Duration::from_secs(3)).await;
                    response.delete(&ctx.http).await?;
                }
            } else {
                let response = msg.reply_ping(&ctx.http, "Timed out waiting for reaction.").await?;
                sleep(Duration::from_secs(3)).await;
                response.delete(&ctx.http).await?;
            }
            react_msg.delete(&ctx.http).await?;
        }
    }
    msg.delete(&ctx.http).await?;
    Ok(())
}

#[command]
async fn unmark (_ctx: &Context, _msg: &Message) -> CommandResult {
    Ok(())
}