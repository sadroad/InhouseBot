use crate::lib::inhouse::*;
use crate::{Prefix, QueueChannel, QueueEmbed};

use serenity::collector::{EventCollectorBuilder, ReactionAction::*};
use serenity::framework::standard::{macros::command, Args, CommandResult};
use serenity::futures::StreamExt;
use serenity::model::id::MessageId;
use serenity::model::prelude::*;
use serenity::prelude::*;
use std::collections::HashSet;
use std::sync::{Arc, Mutex};
use tokio::time::{sleep, Duration};

#[command]
#[aliases("Queue")]
pub async fn queue(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    //TODO check if the user is currently waiting for a game to be started or in a game
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
    let prefix;
    let body;
    let num_players;
    let missing_roles;
    let queue_channel;
    {
        let data = ctx.data.read().await;
        let queue = data.get::<QueueManager>().unwrap();
        let mut queue = queue.lock().await;
        queue_channel = *data.get::<QueueChannel>().unwrap().lock().await;
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
        {
            let data = ctx.data.read().await;
            let queue = data.get::<QueueEmbed>().unwrap();
            if *queue.lock().await == MessageId(0) {
                let response = queue_channel
                    .send_message(&ctx.http, |m| {
                        m.embed(|e| {
                            e.field("Queue", body, true)
                            .footer(|f| f.text(&format!("Use {}queue <role> to join or {}leave <role?> to leave | All non-queue messages are deleted", prefix, prefix)))
                        })
                }).await.unwrap();
                let response = response.id;
                *queue.lock().await = response;
            } else if missing_roles != *"A test string" {
                queue_channel
                .edit_message(&ctx.http, *queue.lock().await, |m| {
                    m.embed(|e| {
                        e.field("Queue", body,false)
                        .field("Missing Roles", missing_roles, false)
                        .field("# of Unique Players", num_players.to_string(), false)
                        .footer(|f| f.text(&format!("Use {}queue <role> to join or {}leave <role?> to leave | All non-queue messages are deleted", prefix, prefix)))
                    })
                }).await.unwrap();
            } else {
                queue_channel
                .edit_message(&ctx, *queue.lock().await, |m| {
                    m.embed(|e| {
                        e.field("Queue", body,false)
                        .field("# of Unique Players", num_players.to_string(), false)
                        .footer(|f| f.text(&format!("Use {}queue <role> to join or {}leave <role?> to leave | All non-queue messages are deleted", prefix, prefix)))
                    })
                }).await.unwrap();
            }
        }
    }
    show_games(ctx, guild_id).await;
}

async fn show_games(ctx: &Context, guild_id: GuildId) {
    let mut remove_games: Vec<(i32, HashSet<UserId>)> = Vec::new();
    {
        let data = ctx.data.read().await;
        let mut queue = data.get::<QueueManager>().unwrap().lock().await;
        let games = &mut queue.tentative_games;
        let queue_channel = *data.get::<QueueChannel>().unwrap().lock().await;
        if !games.is_empty() {
            for mut game in games {
                if game.displayed {
                    continue;
                }
                let body = game.display(ctx, guild_id).await;
                dbg!(&body.0);
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
                    // game.displayed = true;
                    response.react(&ctx.http, '✅').await.unwrap();
                    response.react(&ctx.http, '❌').await.unwrap();
                    let mut collector = EventCollectorBuilder::new(&ctx)
                        .add_event_type(EventType::ReactionAdd)
                        .add_event_type(EventType::ReactionRemove)
                        .add_message_id(game.message_id)
                        .timeout(Duration::from_secs(180))
                        .build()
                        .unwrap();
                    let mut game_ready = false;
                    let mut afk_players: HashSet<UserId> = HashSet::new();
                    dbg!("stuck waitin");
                    'collector: while let Some(event) = collector.next().await {
                        dbg!("didn't even make it");
                        match event.as_ref() {
                            Event::ReactionAdd(e) => {
                                let reaction = &e.reaction;
                                dbg!("{:?}", &reaction.emoji);
                                let result = game
                                    .update_status(reaction.user_id.unwrap(), &reaction.emoji)
                                    .await;
                                dbg!(&result);
                                match result {
                                    Ok(_) => {
                                        let body = game.display(ctx, guild_id).await;
                                        queue_channel
                                            .edit_message(&ctx.http, game.message_id, |m| {
                                                m.embed(|e| {
                                                    e.title("📢 Game found 📢")
                                                    .description(&format!("Blue side expected winrate is {}\nIf you are ready to play, press ✅\nIf you cannot play, press ❌\nThe queue will timeout after a few minutes and AFK players will be automatically dropped from queue", game.expected_winrate))
                                                    .field("BLUE", body.0, true)
                                                    .field("RED", body.1, true)
                                                })
                                            })
                                            .await
                                            .unwrap();
                                        dbg!("done");
                                    }
                                    Err(e) => {
                                        afk_players.insert(e);
                                        break 'collector;
                                    }
                                }
                            }
                            Event::ReactionRemove(e) => {
                                let reaction = &e.reaction;
                                let result = game
                                    .unready(reaction.user_id.unwrap(), &reaction.emoji)
                                    .await;
                                if result {
                                    let body = game.display(ctx, guild_id).await;
                                    queue_channel
                                        .edit_message(&ctx.http, game.message_id, |m| {
                                            m.embed(|e| {
                                                e.title("📢 Game found 📢")
                                                .description(&format!("Blue side expected winrate is {}\nIf you are ready to play, press ✅\nIf you cannot play, press ❌\nThe queue will timeout after a few minutes and AFK players will be automatically dropped from queue", game.expected_winrate))
                                                .field("BLUE", body.0, true)
                                                .field("RED", body.1, true)
                                            })
                                        })
                                        .await
                                        .unwrap();
                                    dbg!("done");
                                }
                            }
                            e => panic!("Unexpected event: {:?}", e),
                        }
                        dbg!("here");
                        game_ready = game.is_ready().await;
                        dbg!(&game_ready);
                        if game_ready {
                            break;
                        }
                    }
                    dbg!("out of the while loop");
                    if game_ready {
                        //TODO make the game ready and move it to current_games
                        dbg!("game rdy");
                    } else {
                        //TODO remove the game from tentative_games and put players back in queue
                        if afk_players.is_empty() {
                            afk_players = game.get_afk_players().await;
                            dbg!(&afk_players);
                        }
                        dbg!("removing paytesr");
                        remove_games.push((game.id.clone(), afk_players.clone()));
                    }
                }
            }
        }
    }
    dbg!("ran this");
    let data = ctx.data.read().await;
    let queue_channel = *data.get::<QueueChannel>().unwrap().lock().await;
    let mut queue = data.get::<QueueManager>().unwrap().lock().await;
    for (id, afk_players) in &remove_games {
        queue
            .remove_game(&id, afk_players, ctx, queue_channel)
            .await;
    }
}

async fn check_queue_channel(ctx: &Context, msg: &Message) -> bool {
    {
        let data = ctx.data.read().await;
        let channel_id = *data.get::<QueueChannel>().unwrap().lock().await;
        if channel_id != msg.channel_id {
            return false;
        }
    }
    true
}
