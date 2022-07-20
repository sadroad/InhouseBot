use crate::{Prefix, QueueChannel, QUEUE_MANAGER};

use super::queue::display;

use serenity::framework::standard::{macros::command, Args, CommandResult};
use serenity::http::Http;
use serenity::model::prelude::*;
use serenity::prelude::*;
use tokio::time::{sleep, Duration};

use std::sync::Arc;

use crate::lib::inhouse::BOT_EMOJI;
use crate::lib::inhouse::JG_EMOJI;
use crate::lib::inhouse::MID_EMOJI;
use crate::lib::inhouse::SUP_EMOJI;
use crate::lib::inhouse::TOP_EMOJI;

use rand::Rng;
use tracing::log::info;

use crate::lib::database::{update_emoji, update_queue_channel};
use crate::DBCONNECTION;

// TODO Add support for marking more channels as other types of channels (e.g. log channels) or for marking multiple queue channels for different mmr ranges
#[command]
async fn mark(ctx: &Context, msg: &Message) -> CommandResult {
    //TODO Add ability to mark command channel where only bot commands will be registered
    let channel_id;
    {
        let data = ctx.data.read().await;
        channel_id = *data.get::<QueueChannel>().unwrap().lock().await;
    }
    if msg.channel_id != channel_id {
        if channel_id != ChannelId(0) {
            let prefix;
            {
                let data = ctx.data.read().await;
                prefix = data.get::<Prefix>().unwrap().clone();
            }
            let response = msg
                .reply_ping(
                    &ctx.http,
                    &format!(
                        "You must first unmark the prior queue channel. Use {}admin unmark",
                        prefix
                    ),
                )
                .await?;
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
                        let data = ctx.data.read().await;
                        let queue_channel = data.get::<QueueChannel>().unwrap();
                        *queue_channel.lock().await = msg.channel_id;
                        // let queue = data.get::<QueueEmbed>().unwrap();
                        let conn = DBCONNECTION.db_connection.get().unwrap();
                        update_queue_channel(&conn, &msg.channel_id);
                    }
                    let response = msg.reply_ping(&ctx.http, "Queue channel marked.").await?;
                    sleep(Duration::from_secs(3)).await;
                    response.delete(&ctx.http).await?;
                    clear_channel(&ctx.http, msg.channel_id).await;
                    display(ctx, msg.guild_id.unwrap()).await;
                } else {
                    let response = msg.reply_ping(&ctx.http, "Cancelled.").await?;
                    sleep(Duration::from_secs(3)).await;
                    response.delete(&ctx.http).await?;
                }
            } else {
                let response = msg
                    .reply_ping(&ctx.http, "Timed out waiting for reaction.")
                    .await?;
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
async fn unmark(ctx: &Context, msg: &Message) -> CommandResult {
    let channel_id;
    {
        let data = ctx.data.read().await;
        channel_id = *data.get::<QueueChannel>().unwrap().lock().await;
    }
    if channel_id != ChannelId(0) {
        if msg.channel_id != channel_id {
            let prefix;
            {
                let data = ctx.data.read().await;
                prefix = data.get::<Prefix>().unwrap().clone();
            }
            let response = msg
                .reply_ping(
                    &ctx.http,
                    &format!(
                        "You must first mark the prior queue channel. Use {}admin mark",
                        prefix
                    ),
                )
                .await?;
            sleep(Duration::from_secs(3)).await;
            response.delete(&ctx.http).await?;
        } else {
            {
                let data = ctx.data.read().await;
                let queue_channel = data.get::<QueueChannel>().unwrap();
                *queue_channel.lock().await = ChannelId(0);
                // let queue = data.get::<QueueEmbed>().unwrap();
                // let queue = Arc::clone(queue);
                let conn = DBCONNECTION.db_connection.get().unwrap();
                update_queue_channel(&conn, &ChannelId(0));
            }
            let response = msg.reply_ping(&ctx.http, "Queue channel unmarked.").await?;
            sleep(Duration::from_secs(3)).await;
            response.delete(&ctx.http).await?;
            clear_channel(&ctx.http, msg.channel_id).await;
        }
    } else {
        let response = msg
            .reply_ping(&ctx.http, "No queue channel marked.")
            .await?;
        sleep(Duration::from_secs(3)).await;
        response.delete(&ctx.http).await?;
    }
    msg.delete(&ctx.http).await?;
    Ok(())
}

pub async fn clear_channel(ctx: &Arc<Http>, channel: ChannelId) {
    if channel != ChannelId(0) {
        let messages = channel.messages(&ctx, |m| m).await.unwrap();
        for message in messages {
            message.delete(&ctx).await.unwrap();
        }
    }
}

#[command]
#[aliases("roleEmojis")]
async fn role_emojis(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    if args.len() != 5 {
        let prefix;
        {
            let data = ctx.data.read().await;
            prefix = data.get::<Prefix>().unwrap().clone();
        }
        let response = msg.reply_ping(&ctx.http, &format!("Usage: {}admin roleEmojis <top emoji> <jg emoji> <mid emoji> <bot emoji> <sup emoji>", prefix)).await?;
        sleep(Duration::from_secs(3)).await;
        response.delete(&ctx.http).await?;
    } else {
        let top = args.single::<String>().unwrap() + " ";
        *TOP_EMOJI.lock().unwrap() = format!("{} ", top);
        let jg = args.single::<String>().unwrap() + " ";
        *JG_EMOJI.lock().unwrap() = format!("{} ", jg);
        let mid = args.single::<String>().unwrap() + " ";
        *MID_EMOJI.lock().unwrap() = format!("{} ", mid);
        let bot = args.single::<String>().unwrap() + " ";
        *BOT_EMOJI.lock().unwrap() = format!("{} ", bot);
        let sup = args.single::<String>().unwrap() + " ";
        *SUP_EMOJI.lock().unwrap() = format!("{} ", sup);
        {
            let conn = DBCONNECTION.db_connection.get().unwrap();
            update_emoji(&conn, [&top, &jg, &mid, &bot, &sup]);
        }
        let response = msg
            .reply_ping(&ctx.http, "Role Emojis have been set!")
            .await?;
        sleep(Duration::from_secs(3)).await;
        response.delete(&ctx.http).await?;
    }
    msg.delete(&ctx.http).await?;
    Ok(())
}

#[command]
async fn test(ctx: &Context, msg: &Message) -> CommandResult {
    {
        let mut queue = QUEUE_MANAGER.lock().await;
        //register 10 fake players
        info!("Registering 10 fake players");
        for i in 0..10 {
            //random range
            let mut rng = rand::thread_rng();
            let rng = rng.gen_range(15.0..=45.0);
            queue.unregister_player(UserId(i));
            queue.register_player(UserId(i), vec![], rng);
        }
        info!("Done. Adding to queue");
        queue.queue_player(UserId(0), &String::from("top")).unwrap();
        queue.queue_player(UserId(1), &String::from("top")).unwrap();
        queue.queue_player(UserId(2), &String::from("jng")).unwrap();
        queue.queue_player(UserId(3), &String::from("jng")).unwrap();
        queue.queue_player(UserId(4), &String::from("mid")).unwrap();
        queue.queue_player(UserId(5), &String::from("mid")).unwrap();
        queue.queue_player(UserId(6), &String::from("bot")).unwrap();
        queue.queue_player(UserId(7), &String::from("bot")).unwrap();
        queue.queue_player(UserId(8), &String::from("sup")).unwrap();
        queue.queue_player(UserId(9), &String::from("sup")).unwrap();
        info!("Done.");
        let response = msg.reply_ping(&ctx.http, "Test complete.").await?;
        sleep(Duration::from_secs(3)).await;
        response.delete(&ctx.http).await?;
    }
    display(ctx, msg.guild_id.unwrap()).await;
    msg.delete(&ctx.http).await?;
    Ok(())
}

#[command]
pub async fn remove(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    if args.len() != 1 {
        let prefix;
        {
            let data = ctx.data.read().await;
            prefix = data.get::<Prefix>().unwrap().clone();
        }
        let response = msg
            .reply_ping(&ctx.http, format!("Usage: {}admin remove @user", prefix))
            .await?;
        sleep(Duration::from_secs(3)).await;
        response.delete(&ctx.http).await?;
        return Ok(());
    } else {
        dbg!(&args);
        let user = args
            .single::<String>()
            .unwrap()
            .replace("<@", "")
            .replace('>', "");
        let user = user.parse::<UserId>().unwrap();
        {
            let mut queue = QUEUE_MANAGER.lock().await;
            queue.leave_queue(user, "");
        }
        display(ctx, msg.guild_id.unwrap()).await;
    }
    Ok(())
}

#[command]
pub async fn clear(ctx: &Context, msg: &Message) -> CommandResult {
    {
        let mut queue = QUEUE_MANAGER.lock().await;
        queue.clear_queue().await;
    }
    display(ctx, msg.guild_id.unwrap()).await;
    Ok(())
}
