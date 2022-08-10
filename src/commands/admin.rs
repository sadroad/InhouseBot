use crate::{QueueChannel, QueueEmbed, QUEUE_MANAGER};

use super::queue::display;

use serenity::http::Http;
use serenity::model::application::interaction::application_command::ApplicationCommandInteraction;
use serenity::model::application::interaction::InteractionResponseType;
use serenity::model::prelude::interaction::application_command::CommandDataOption;
use serenity::model::prelude::interaction::application_command::CommandDataOptionValue;
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
pub async fn mark(
    ctx: &Context,
    command: &ApplicationCommandInteraction,
) -> Result<(), SerenityError> {
    //TODO Add ability to mark command channel where only bot commands will be registered
    let channel_id;
    {
        let data = ctx.data.read().await;
        channel_id = *data.get::<QueueChannel>().unwrap().lock().await;
    }
    if command.channel_id != channel_id {
        if channel_id != ChannelId(0) {
            command
                .create_interaction_response(&ctx.http, |response| {
                    response
                        .kind(InteractionResponseType::ChannelMessageWithSource)
                        .interaction_response_data(|message| {
                            message.ephemeral(true).content(
                                "You must first unmark the prior queue channel. Use /unmark",
                            )
                        })
                })
                .await
                .unwrap();
            sleep(Duration::from_secs(3)).await;
            return command
                .delete_original_interaction_response(&ctx.http)
                .await;
        } else {
            command
                .create_interaction_response(&ctx.http, |response| {
                    response.kind(InteractionResponseType::DeferredChannelMessageWithSource)
                })
                .await
                .unwrap();
            let react_msg = command
                .create_followup_message(&ctx.http, |response| {
                    response
                    .ephemeral(true)
                    .content(
                        String::from("Confirm that you want to mark this channel as a queue channel, this will delete all messages currently in the channel. React with :white_check_mark: to confirm or :x: to cancel.")
                    )
                })
                .await.unwrap();

            react_msg.react(&ctx.http, '✅').await?;
            react_msg.react(&ctx.http, '❌').await?;

            if let Some(reaction) = &react_msg
                .await_reaction(&ctx)
                .timeout(Duration::from_secs(60))
                .author_id(command.member.as_ref().unwrap().user.id)
                .await
            {
                let emoji = &reaction.as_inner_ref().emoji;
                if emoji.as_data().as_str() == "✅" {
                    {
                        let data = ctx.data.read().await;
                        let queue_channel = data.get::<QueueChannel>().unwrap();
                        let queue = data.get::<QueueEmbed>().unwrap();
                        *queue_channel.lock().await = command.channel_id;
                        *queue.lock().await = MessageId(0);
                        let conn = DBCONNECTION.db_connection.get().unwrap();
                        update_queue_channel(&conn, &command.channel_id);
                    }
                    command
                        .edit_original_interaction_response(&ctx.http, |response| {
                            response.content(String::from("Queue channel marked"))
                        })
                        .await
                        .unwrap();
                    sleep(Duration::from_secs(3)).await;
                    command
                        .delete_original_interaction_response(&ctx.http)
                        .await
                        .unwrap();
                    clear_channel(&ctx.http, command.channel_id).await;
                    display(ctx, command.guild_id.unwrap()).await;
                } else {
                    command
                        .edit_original_interaction_response(&ctx.http, |response| {
                            response.content(String::from("Cancelled"))
                        })
                        .await
                        .unwrap();
                    sleep(Duration::from_secs(3)).await;
                    command
                        .delete_original_interaction_response(&ctx.http)
                        .await
                        .unwrap();
                }
            } else {
                command
                    .edit_original_interaction_response(&ctx.http, |response| {
                        response.content(String::from("Timed out waiting for reaction"))
                    })
                    .await
                    .unwrap();
                sleep(Duration::from_secs(3)).await;
                command
                    .delete_original_interaction_response(&ctx.http)
                    .await
                    .unwrap();
            }
            react_msg.delete(&ctx.http).await?;
        }
    }
    Ok(())
}

pub async fn unmark(
    ctx: &Context,
    command: &ApplicationCommandInteraction,
) -> Result<(), SerenityError> {
    let channel_id;
    {
        let data = ctx.data.read().await;
        channel_id = *data.get::<QueueChannel>().unwrap().lock().await;
    }
    if channel_id != ChannelId(0) {
        if command.channel_id != channel_id {
            command
                .create_interaction_response(&ctx.http, |response| {
                    response
                        .kind(InteractionResponseType::ChannelMessageWithSource)
                        .interaction_response_data(|message| {
                            message
                                .ephemeral(true)
                                .content("You must first mark the prior queue channel. Use /mark")
                        })
                })
                .await
        } else {
            {
                let data = ctx.data.read().await;
                let queue_channel = data.get::<QueueChannel>().unwrap();
                *queue_channel.lock().await = ChannelId(0);
                let conn = DBCONNECTION.db_connection.get().unwrap();
                update_queue_channel(&conn, &ChannelId(0));
            }
            clear_channel(&ctx.http, command.channel_id).await;
            command
                .create_interaction_response(&ctx.http, |response| {
                    response
                        .kind(InteractionResponseType::ChannelMessageWithSource)
                        .interaction_response_data(|message| {
                            message.ephemeral(true).content("Queue channel unmarked.")
                        })
                })
                .await
        }
    } else {
        command
            .create_interaction_response(&ctx.http, |response| {
                response
                    .kind(InteractionResponseType::ChannelMessageWithSource)
                    .interaction_response_data(|message| {
                        message.ephemeral(true).content("No queue channel marked.")
                    })
            })
            .await
    }
}

pub async fn clear_channel(ctx: &Arc<Http>, channel: ChannelId) {
    if channel != ChannelId(0) {
        let messages = channel.messages(&ctx, |m| m).await.unwrap();
        for message in messages {
            message.delete(&ctx).await.unwrap();
        }
    }
}

fn rem_front_last(str: &str) -> String {
    let mut chars = str.chars();
    chars.next();
    chars.next_back();
    chars.collect()
}

pub async fn role_emojis(
    ctx: &Context,
    command: &ApplicationCommandInteraction,
    sub_command: &CommandDataOption,
) -> Result<(), SerenityError> {
    let mut args = sub_command.options.iter();
    let top = rem_front_last(&args.next().unwrap().value.as_ref().unwrap().to_string());
    *TOP_EMOJI.write().unwrap() = format!("{} ", top);
    let jg = rem_front_last(&args.next().unwrap().value.as_ref().unwrap().to_string());
    *JG_EMOJI.write().unwrap() = format!("{} ", jg);
    let mid = rem_front_last(&args.next().unwrap().value.as_ref().unwrap().to_string());
    *MID_EMOJI.write().unwrap() = format!("{} ", mid);
    let bot = rem_front_last(&args.next().unwrap().value.as_ref().unwrap().to_string());
    *BOT_EMOJI.write().unwrap() = format!("{} ", bot);
    let sup = rem_front_last(&args.next().unwrap().value.as_ref().unwrap().to_string());
    *SUP_EMOJI.write().unwrap() = format!("{} ", sup);
    {
        let conn = DBCONNECTION.db_connection.get().unwrap();
        update_emoji(&conn, [&top, &jg, &mid, &bot, &sup]);
    }
    display(ctx, command.guild_id.unwrap()).await;
    command
        .create_interaction_response(&ctx.http, |response| {
            response
                .kind(InteractionResponseType::ChannelMessageWithSource)
                .interaction_response_data(|message| {
                    message
                        .ephemeral(true)
                        .content("Role emojis have been updated.")
                })
        })
        .await
}

pub async fn test(
    ctx: &Context,
    command: &ApplicationCommandInteraction,
) -> Result<(), SerenityError> {
    {
        let mut queue = QUEUE_MANAGER.write().await;
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
        queue
            .queue_player(UserId(0), &String::from("top"), false)
            .await
            .unwrap();
        queue
            .queue_player(UserId(1), &String::from("top"), false)
            .await
            .unwrap();
        queue
            .queue_player(UserId(2), &String::from("jng"), false)
            .await
            .unwrap();
        queue
            .queue_player(UserId(3), &String::from("jng"), false)
            .await
            .unwrap();
        queue
            .queue_player(UserId(4), &String::from("mid"), false)
            .await
            .unwrap();
        queue
            .queue_player(UserId(5), &String::from("mid"), false)
            .await
            .unwrap();
        queue
            .queue_player(UserId(6), &String::from("bot"), false)
            .await
            .unwrap();
        queue
            .queue_player(UserId(7), &String::from("bot"), false)
            .await
            .unwrap();
        queue
            .queue_player(UserId(8), &String::from("sup"), false)
            .await
            .unwrap();
        queue
            .queue_player(UserId(9), &String::from("sup"), false)
            .await
            .unwrap();
        info!("Done.");
    }
    display(ctx, command.guild_id.unwrap()).await;
    command
        .create_interaction_response(&ctx.http, |response| {
            response
                .kind(InteractionResponseType::ChannelMessageWithSource)
                .interaction_response_data(|message| {
                    message.ephemeral(true).content("Test users added")
                })
        })
        .await
}

pub async fn remove(
    ctx: &Context,
    command: &ApplicationCommandInteraction,
    sub_command: &CommandDataOption,
) -> Result<(), SerenityError> {
    command.defer(&ctx.http).await.unwrap();
    command
        .delete_original_interaction_response(&ctx.http)
        .await
        .unwrap();
    if let CommandDataOptionValue::User(user, _member) = sub_command
        .options
        .get(0)
        .expect("Expected user")
        .resolved
        .as_ref()
        .expect("Expected user object")
    {
        let user = user.id;
        {
            let mut queue = QUEUE_MANAGER.write().await;
            queue.leave_queue(user, "").unwrap();
        }
        display(ctx, command.guild_id.unwrap()).await;
    }
    Ok(())
}

pub async fn clear(
    ctx: &Context,
    command: &ApplicationCommandInteraction,
) -> Result<(), SerenityError> {
    command.defer(&ctx.http).await.unwrap();
    command
        .delete_original_interaction_response(&ctx.http)
        .await
        .unwrap();
    {
        let mut queue = QUEUE_MANAGER.write().await;
        queue.clear_queue().await;
    }
    display(ctx, command.guild_id.unwrap()).await;
    Ok(())
}
