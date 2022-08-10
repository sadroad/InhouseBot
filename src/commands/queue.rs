use crate::{QueueChannel, QueueEmbed, Riot, QUEUE_MANAGER};

use serenity::collector::EventCollectorBuilder;
use serenity::futures::StreamExt;
use serenity::model::application::interaction::application_command::ApplicationCommandInteraction;
use serenity::model::application::interaction::InteractionResponseType;
use serenity::model::id::MessageId;
use serenity::model::prelude::interaction::application_command::CommandDataOptionValue;
use serenity::model::prelude::*;
use serenity::prelude::*;

use async_recursion::async_recursion;
use tokio::task;
use tokio::time::{sleep, Duration};
use tracing::error;

use rayon::prelude::*;

pub async fn queue(
    ctx: &Context,
    command: &ApplicationCommandInteraction,
) -> Result<(), SerenityError> {
    let mut result = Ok(());
    let player = command.user.id;
    command.defer(&ctx.http).await?;
    let tmp = CommandDataOptionValue::String(String::from(""));
    if let CommandDataOptionValue::String(role) = match command.data.options.get(0) {
        Some(role) => role.resolved.as_ref().expect("Expected a string"),
        None => &tmp,
    } {
        let mut queue = QUEUE_MANAGER.lock().await;
        dbg!("after lock");
        dbg!("queing player");
        result = queue.queue_player(player, role, false).await;
    } else {
        error!("No role specified, somehow past discord");
    }
    if let Err(e) = result {
        dbg!("error queuing player");
        command
            .create_followup_message(&ctx.http, |message| {
                message.content(format!("Error: {}", e))
            })
            .await
            .unwrap();
        sleep(Duration::from_secs(3)).await;
        command
            .delete_original_interaction_response(&ctx.http)
            .await
            .unwrap();
        return Ok(());
    }
    let guild_id = command.guild_id.unwrap();
    //only used to get variables for discord api
    let tmp_ctx = ctx.clone();
    task::spawn(async move {
        //2 hours in seconds
        sleep(Duration::from_secs(7200)).await;
        let result;
        {
            let mut queue = QUEUE_MANAGER.lock().await;
            result = queue.leave_queue(player, "");
            dbg!(&result);
        }
        match result {
            Ok(_) => {
                display(&tmp_ctx, guild_id).await;
                let channel_id;
                {
                    let data = tmp_ctx.data.read().await;
                    channel_id = *data.get::<QueueChannel>().unwrap().lock().await;
                }
                let response = channel_id
                    .say(
                        &tmp_ctx.http,
                        format!(
                            "<@{}> You have been removed from the queue due to inactivity.",
                            player
                        ),
                    )
                    .await
                    .unwrap();
                sleep(Duration::from_secs(5)).await;
                response.delete(&tmp_ctx.http).await.unwrap();
            }
            Err(e) => {
                dbg!("error leaving queue");
                dbg!(e);
            }
        }
    });
    dbg!("queued player");
    command
        .delete_original_interaction_response(&ctx.http)
        .await
        .unwrap();

    let result;
    {
        let mut queue = QUEUE_MANAGER.lock().await;
        result = queue.check_for_game().await;
    }
    dbg!("getting guild id ");
    dbg!("running display");
    display(ctx, guild_id).await;
    if result {
        dbg!("running show_games");
        show_games(ctx, guild_id).await;
    }
    Ok(())
}

pub async fn leave(
    ctx: &Context,
    command: &ApplicationCommandInteraction,
) -> Result<(), SerenityError> {
    command.defer(&ctx.http).await?;
    command
        .delete_original_interaction_response(&ctx.http)
        .await?;
    let tmp = CommandDataOptionValue::String(String::from(""));
    if let CommandDataOptionValue::String(role) = match command.data.options.get(0) {
        Some(role) => role.resolved.as_ref().expect("Expected a string"),
        None => &tmp,
    } {
        internal_leave(command.user.id, role).await;
        let guild_id = command.guild_id.unwrap();
        display(ctx, guild_id).await;
    }
    Ok(())
}

async fn internal_leave(user: UserId, role: &str) {
    let mut queue = QUEUE_MANAGER.lock().await;
    queue.leave_queue(user, role).unwrap();
}

//TODO allow people to cancel the vote without canceling the game ex. supply a red x to cancel the vote
pub async fn won(
    ctx: &Context,
    command: &ApplicationCommandInteraction,
) -> Result<(), SerenityError> {
    let user = command.user.id;
    let game;
    {
        let queue = QUEUE_MANAGER.lock().await;
        game = queue.get_side(user).await;
    }
    match game {
        Ok(game) => {
            let guild_id = command.guild_id.unwrap();
            let channel_id = command.channel_id;
            command
                .create_interaction_response(&ctx.http, |response| {
                    response.kind(InteractionResponseType::DeferredChannelMessageWithSource)
                })
                .await
                .unwrap();
            let react_message = command.create_followup_message(&ctx.http, |message| {
            message.content(format!(
                "{} has started a vote to score the winner of Game {} as {}. React with a ✅ to vote for the game's outcome.\nI'll wait for 180 seconds for the required 6+ votes.",
                user.mention(),
                game.0,
                game.1,
            ))
        })
        .await.unwrap();
            react_message.react(&ctx.http, '✅').await?;
            let mut collector = EventCollectorBuilder::new(&ctx)
                .add_event_type(EventType::ReactionAdd)
                .add_event_type(EventType::ReactionRemove)
                .add_message_id(react_message.id)
                .timeout(Duration::from_secs(180))
                .build()
                .unwrap();
            let mut votes = 0;
            while let Some(event) = collector.next().await {
                match event.as_ref() {
                    Event::ReactionAdd(reaction) => {
                        if reaction.reaction.emoji == ReactionType::Unicode(String::from("✅")) {
                            votes += 1;
                            if votes >= 6 {
                                react_message.delete(&ctx.http).await?;
                                let response = channel_id
                                        .say(
                                            &ctx.http,
                                            "Vote to confirm the game's outcome has passed. The game will be scored.".to_string(),
                                        )
                                        .await?;
                                sleep(Duration::from_secs(3)).await;
                                response.delete(&ctx.http).await?;
                                let mentions;
                                {
                                    let queue = QUEUE_MANAGER.lock().await;
                                    mentions = queue.players_to_requeue(game.0).await;
                                }
                                let no_requeue = channel_id.say(&ctx.http, &format!("{}\n I will requeue you in 5 seconds. If you **dont** want to be queued, react with a ❌", mentions)).await?;
                                no_requeue.react(&ctx.http, '❌').await?;
                                let mut collector = EventCollectorBuilder::new(&ctx)
                                    .add_event_type(EventType::ReactionAdd)
                                    .add_event_type(EventType::ReactionRemove)
                                    .add_message_id(no_requeue.id)
                                    .timeout(Duration::from_secs(10))
                                    .build()
                                    .unwrap();
                                let mut dont_queue = Vec::new();
                                while let Some(event) = collector.next().await {
                                    match event.as_ref() {
                                        Event::ReactionAdd(reaction) => {
                                            if reaction.reaction.emoji
                                                == ReactionType::Unicode(String::from("❌"))
                                            {
                                                dont_queue.push(reaction.reaction.user_id.unwrap());
                                            }
                                        }
                                        Event::ReactionRemove(reaction) => {
                                            if reaction.reaction.emoji
                                                == ReactionType::Unicode(String::from("❌"))
                                            {
                                                dont_queue.swap_remove(
                                                    dont_queue
                                                        .par_iter()
                                                        .position_any(|&x| {
                                                            x == reaction.reaction.user_id.unwrap()
                                                        })
                                                        .unwrap(),
                                                );
                                            }
                                        }
                                        _ => {}
                                    }
                                }
                                no_requeue.delete(&ctx.http).await?;
                                {
                                    let mut queue = QUEUE_MANAGER.lock().await;
                                    queue.win(game, ctx, channel_id, dont_queue).await;
                                }
                                display(ctx, guild_id).await;
                                break;
                            }
                        }
                    }
                    Event::ReactionRemove(reaction) => {
                        if reaction.reaction.emoji == ReactionType::Unicode(String::from("✅")) {
                            votes -= 1;
                        }
                    }
                    _ => {}
                }
            }
            if votes < 6 {
                react_message.delete(&ctx.http).await?;
                let response = channel_id
                        .say(
                            &ctx.http,
                            "Vote to confirm game's outcome has failed. The game will not be scored, please try again.".to_string(),
                        )
                        .await?;
                sleep(Duration::from_secs(3)).await;
                response.delete(&ctx.http).await?;
            }
        }
        Err(e) => {
            command
                .create_interaction_response(&ctx.http, |response| {
                    response
                        .kind(InteractionResponseType::ChannelMessageWithSource)
                        .interaction_response_data(|message| {
                            message.ephemeral(true).content(e.to_string())
                        })
                })
                .await
                .unwrap();
        }
    }
    Ok(())
}

pub async fn cancel(
    ctx: &Context,
    command: &ApplicationCommandInteraction,
) -> Result<(), SerenityError> {
    let user = command.user.id;
    let result;
    {
        let data = ctx.data.read().await;
        let mut queue = QUEUE_MANAGER.lock().await;
        let queue_channel = *data.get::<QueueChannel>().unwrap().lock().await;
        result = queue.cancel_game(user, ctx, queue_channel).await;
    }
    if result {
        command
            .create_interaction_response(&ctx.http, |response| {
                response
                    .kind(InteractionResponseType::ChannelMessageWithSource)
                    .interaction_response_data(|message| {
                        message.content(format!(
                            "Game cancelled. {} will not be queued.",
                            command.user.mention()
                        ))
                    })
            })
            .await
            .unwrap();
        sleep(Duration::from_secs(3)).await;
        command
            .delete_original_interaction_response(&ctx.http)
            .await
            .unwrap();
        let guild_id = command.guild_id.unwrap();
        let result;
        {
            let mut queue = QUEUE_MANAGER.lock().await;
            result = queue.check_for_game().await;
        }
        display(ctx, guild_id).await;
        if result {
            show_games(ctx, guild_id).await;
        }
    } else {
        command
            .create_interaction_response(&ctx.http, |response| {
                response
                    .kind(InteractionResponseType::ChannelMessageWithSource)
                    .interaction_response_data(|message| {
                        message
                            .ephemeral(true)
                            .content(format!("You are not in a game. {}", command.user.mention()))
                    })
            })
            .await
            .unwrap();
    }
    Ok(())
}

pub async fn vote_clear(
    ctx: &Context,
    command: &ApplicationCommandInteraction,
) -> Result<(), SerenityError> {
    command.defer(&ctx.http).await.unwrap();
    command
        .delete_original_interaction_response(&ctx.http)
        .await
        .unwrap();
    let channel_id;
    {
        let data = ctx.data.read().await;
        channel_id = *data.get::<QueueChannel>().unwrap().lock().await;
    }
    let response = channel_id
        .say(
            &ctx.http,
            "Vote to clear the queue has started. React with a ✅ to vote to clear the queue.\nI'll wait for 60 seconds for the required 6+ votes.".to_string(),
        )
        .await?;
    response.react(&ctx.http, '✅').await?;
    let mut collector = EventCollectorBuilder::new(&ctx)
        .add_event_type(EventType::ReactionAdd)
        .add_event_type(EventType::ReactionRemove)
        .add_message_id(response.id)
        .timeout(Duration::from_secs(60))
        .build()
        .unwrap();
    let mut votes = 0;
    while let Some(event) = collector.next().await {
        match event.as_ref() {
            Event::ReactionAdd(reaction) => {
                if reaction.reaction.emoji == ReactionType::Unicode(String::from("✅")) {
                    votes += 1;
                    if votes >= 6 {
                        let response = channel_id
                            .say(
                                &ctx.http,
                                "Vote to clear the queue has passed. The queue will be cleared."
                                    .to_string(),
                            )
                            .await?;
                        sleep(Duration::from_secs(3)).await;
                        response.delete(&ctx.http).await?;
                        let guild_id = command.guild_id.unwrap();
                        {
                            let mut queue = QUEUE_MANAGER.lock().await;
                            queue.clear_queue().await;
                        }
                        display(ctx, guild_id).await;
                        break;
                    }
                }
            }
            Event::ReactionRemove(reaction) => {
                if reaction.reaction.emoji == ReactionType::Unicode(String::from("✅")) {
                    votes -= 1;
                }
            }
            _ => {}
        }
    }
    if votes < 6 {
        let response = channel_id
            .say(
                &ctx.http,
                "Vote to clear the queue has failed. The queue will not be cleared.".to_string(),
            )
            .await?;
        sleep(Duration::from_secs(3)).await;
        response.delete(&ctx.http).await?;
    }
    response.delete(&ctx.http).await?;
    Ok(())
}

pub async fn vote_remove(
    ctx: &Context,
    command: &ApplicationCommandInteraction,
) -> Result<(), SerenityError> {
    command.defer(&ctx.http).await.unwrap();
    if let CommandDataOptionValue::User(user, _member) = command
        .data
        .options
        .get(0)
        .expect("Expected user")
        .resolved
        .as_ref()
        .expect("Expected user object")
    {
        if user.id == command.user.id {
            command
                .create_followup_message(&ctx.http, |response| {
                    response.content("🦛🦛🦛🦛🦛🦛🦛🦛🦛🦛🦛".to_string())
                })
                .await
                .unwrap();
            sleep(Duration::from_secs(3)).await;
            command
                .delete_original_interaction_response(&ctx.http)
                .await
                .unwrap();
            internal_leave(user.id, "").await;
            return Ok(());
        } else {
            command
                .delete_original_interaction_response(&ctx.http)
                .await
                .unwrap();
            let channel_id;
            {
                let data = ctx.data.read().await;
                channel_id = *data.get::<QueueChannel>().unwrap().lock().await;
            }
            let response = channel_id
        .say(
            &ctx.http,
            format!(
                "Vote to remove {} has started by {} React with a ✅ to vote kick them.\nI'll wait for 60 seconds for the required 6+ votes.",
                user.mention(),
                command.user.mention()
            ),
        )
        .await?;
            response.react(&ctx.http, '✅').await?;
            let mut collector = EventCollectorBuilder::new(&ctx)
                .add_event_type(EventType::ReactionAdd)
                .add_event_type(EventType::ReactionRemove)
                .add_message_id(response.id)
                .timeout(Duration::from_secs(60))
                .build()
                .unwrap();
            let mut votes = 0;
            while let Some(event) = collector.next().await {
                match event.as_ref() {
                    Event::ReactionAdd(reaction) => {
                        if reaction.reaction.emoji == ReactionType::Unicode(String::from("✅")) {
                            votes += 1;
                            if votes >= 6 {
                                let response = channel_id
                                .say(
                                    &ctx.http,
                                    format!(
                                        "Vote to remove has passed. {} will be removed from the queue.",
                                        user.mention()
                                    ),
                                )
                                .await?;
                                sleep(Duration::from_secs(3)).await;
                                response.delete(&ctx.http).await?;
                                let guild_id = command.guild_id.unwrap();
                                {
                                    let mut queue = QUEUE_MANAGER.lock().await;
                                    queue.leave_queue(user.id, "").unwrap();
                                }
                                display(ctx, guild_id).await;
                                break;
                            }
                        }
                    }
                    Event::ReactionRemove(reaction) => {
                        if reaction.reaction.emoji == ReactionType::Unicode(String::from("✅")) {
                            votes -= 1;
                        }
                    }
                    _ => {}
                }
            }
            if votes < 6 {
                let response = channel_id
                    .say(
                        &ctx.http,
                        "Vote to remove player has failed. The player will not be removed."
                            .to_string(),
                    )
                    .await?;
                sleep(Duration::from_secs(3)).await;
                response.delete(&ctx.http).await?;
            }
            response.delete(&ctx.http).await?;
        }
    }
    Ok(())
}

pub async fn display(ctx: &Context, guild_id: GuildId) {
    let body;
    let num_players;
    let missing_roles;
    let queue_channel;
    {
        let data = ctx.data.read().await;
        let queue = QUEUE_MANAGER.lock().await;
        queue_channel = *data.get::<QueueChannel>().unwrap().lock().await;
        if let Some(missing) = queue.get_missing_roles().await {
            missing_roles = missing;
        } else {
            missing_roles = String::from("A test string");
        }
        body = queue.display(ctx, guild_id).await;
        num_players = queue.number_of_unique_players().await;
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
                            .footer(|f| f.text("Use /queue <role> to join or /leave <role?> to leave | All non-queue messages are deleted"))
                        })
                }).await.unwrap();
                let response = response.id;
                *queue.lock().await = response;
            } else if missing_roles != "A test string" {
                queue_channel
                .edit_message(&ctx.http, *queue.lock().await, |m| {
                    m.embed(|e| {
                        e.field("Queue", body,false)
                        .field("Missing Roles", missing_roles, false)
                        .field("# of Unique Players", num_players.to_string(), false)
                        .footer(|f| f.text("Use /queue <role> to join or /leave <role?> to leave | All non-queue messages are deleted"))
                    })
                }).await.unwrap();
            } else {
                queue_channel
                .edit_message(&ctx, *queue.lock().await, |m| {
                    m.embed(|e| {
                        e.field("Queue", body,false)
                        .field("# of Unique Players", num_players.to_string(), false)
                        .footer(|f| f.text("Use /queue <role> to join or /leave <role?> to leave | All non-queue messages are deleted"))
                    })
                }).await.unwrap();
            }
        }
    }
}

#[async_recursion]
pub async fn show_games(ctx: &Context, guild_id: GuildId) {
    let tentative_games;
    let queue_channel;
    {
        let data = ctx.data.read().await;
        let queue = QUEUE_MANAGER.lock().await;
        tentative_games = queue.get_tentative_games(ctx, guild_id).await;
        queue_channel = *data.get::<QueueChannel>().unwrap().lock().await;
    }
    for game in tentative_games.iter() {
        let body = &game.2;
        let response;
        if game.1 == MessageId(0) {
            //create message
            response = queue_channel
                    .send_message(&ctx.http, |m| {
                        m.content(&body.2)
                        .embed(|e| {
                            e.title("📢 Game found 📢")
                            .description(&format!("Blue side expected winrate is {}\nIf you are ready to play, press ✅\nIf you cannot play, press ❌\nThe queue will timeout after a few minutes and AFK players will be automatically dropped from queue", game.3))
                            .field("BLUE", &body.0, true)
                            .field("RED", &body.1, true)
                        })
                }).await.unwrap();
            let message_id = response.id;
            {
                let mut queue = QUEUE_MANAGER.lock().await;
                queue.set_message_id(game.0, message_id).await;
            }
            response.react(&ctx.http, '✅').await.unwrap();
            response.react(&ctx.http, '❌').await.unwrap();
            let mut collector = EventCollectorBuilder::new(&ctx)
                .add_event_type(EventType::ReactionAdd)
                .add_event_type(EventType::ReactionRemove)
                .add_message_id(message_id)
                .timeout(Duration::from_secs(180))
                .build()
                .unwrap();
            let mut game_ready = false;
            'collector: while let Some(event) = collector.next().await {
                match event.as_ref() {
                    Event::ReactionAdd(e) => {
                        let reaction = &e.reaction;
                        dbg!("{:?}", &reaction.emoji);
                        let result;
                        {
                            let mut queue = QUEUE_MANAGER.lock().await;
                            result = queue
                                .update_status(reaction.user_id.unwrap(), &reaction.emoji, game.0)
                                .await;
                        }
                        dbg!(&result);
                        match result {
                            Ok(_) => {
                                let body;
                                {
                                    let queue = QUEUE_MANAGER.lock().await;
                                    body = queue.get_emebed_body(ctx, guild_id, game.0).await;
                                }
                                queue_channel
                                    .edit_message(&ctx.http, message_id, |m| {
                                        m.embed(|e| {
                                            e.title("📢 Game found 📢")
                                            .description(&format!("Blue side expected winrate is {}\nIf you are ready to play, press ✅\nIf you cannot play, press ❌\nThe queue will timeout after a few minutes and AFK players will be automatically dropped from queue", game.3))
                                            .field("BLUE", body.0, true)
                                            .field("RED", body.1, true)
                                        })
                                    })
                                    .await
                                    .unwrap();
                                dbg!("done");
                            }
                            Err(_) => {
                                break 'collector;
                            }
                        }
                    }
                    Event::ReactionRemove(e) => {
                        let reaction = &e.reaction;
                        let result;
                        {
                            let mut queue = QUEUE_MANAGER.lock().await;
                            result = queue
                                .unready(reaction.user_id.unwrap(), &reaction.emoji, game.0)
                                .await;
                        }
                        if result {
                            let body;
                            {
                                let queue = QUEUE_MANAGER.lock().await;
                                body = queue.get_emebed_body(ctx, guild_id, game.0).await;
                            }
                            queue_channel
                                .edit_message(&ctx.http, message_id, |m| {
                                    m.embed(|e| {
                                        e.title("📢 Game found 📢")
                                        .description(&format!("Blue side expected winrate is {}\nIf you are ready to play, press ✅\nIf you cannot play, press ❌\nThe queue will timeout after a few minutes and AFK players will be automatically dropped from queue", game.3))
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
                dbg!("checking if game is ready");
                {
                    let queue = QUEUE_MANAGER.lock().await;
                    game_ready = queue.is_game_ready(game.0).await;
                }
                if game_ready {
                    break;
                }
            }
            if game_ready {
                dbg!("starting game");
                {
                    let data = ctx.data.read().await;
                    let mut queue = QUEUE_MANAGER.lock().await;
                    let riot = data.get::<Riot>().unwrap();
                    queue
                        .start_game(&game.0, ctx, queue_channel, message_id, guild_id, riot)
                        .await;
                }
            } else {
                dbg!("adding players back to queue");
                let result;
                {
                    let mut queue = QUEUE_MANAGER.lock().await;
                    queue
                        .remove_game(&game.0, ctx, queue_channel, message_id)
                        .await;
                    result = queue.check_for_game().await;
                }
                display(ctx, guild_id).await;
                if result {
                    show_games(ctx, guild_id).await;
                }
            }
        }
    }
}
