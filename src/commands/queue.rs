use crate::lib::inhouse::*;
use crate::{Prefix, QueueChannel, QueueEmbed, Riot};

use serenity::collector::EventCollectorBuilder;
use serenity::framework::standard::{macros::command, Args, CommandResult};
use serenity::futures::StreamExt;
use serenity::model::id::MessageId;
use serenity::model::prelude::*;
use serenity::prelude::*;

use async_recursion::async_recursion;
use tokio::task;
use tokio::time::{sleep, Duration};

#[command]
#[aliases("Queue")]
pub async fn queue(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    dbg!("before check");
    match check_queue_channel(ctx, msg).await {
        Ok(value) => {
            if value {
                dbg!("after check");
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
                    dbg!("args passed");
                    let role = args.single::<String>().unwrap();
                    let result;
                    let player = msg.author.id;
                    {
                        let data = ctx.data.read().await;
                        dbg!("before get");
                        let queue = data.get::<QueueManager>().unwrap();
                        dbg!("after get");
                        let mut queue = queue.lock().await;
                        dbg!("after lock");
                        dbg!("queing player");
                        result = queue.queue_player(player, &role);
                    }
                    if let Err(e) = result {
                        dbg!("error queuing player");
                        let response = msg
                            .reply_mention(&ctx.http, &format!("Error: {}", e))
                            .await?;
                        sleep(Duration::from_secs(3)).await;
                        response.delete(&ctx.http).await?;
                    }
                    let guild_id = msg.guild_id.unwrap();
                    let tmp_ctx = ctx.clone();
                    task::spawn(async move {
                        //2 hours in seconds
                        sleep(Duration::from_secs(7200)).await;
                        let result;
                        {
                            let data = tmp_ctx.data.read().await;
                            let queue = data.get::<QueueManager>().unwrap();
                            let mut queue = queue.lock().await;
                            result = queue.leave_queue(player, "");
                        }
                        if result {
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
                    });
                    dbg!("queued player");

                    let result;
                    {
                        let data = ctx.data.write().await;
                        let mut queue = data.get::<QueueManager>().unwrap().lock().await;
                        result = queue.check_for_game().await;
                    }
                    dbg!("getting guild id ");
                    dbg!("running display");
                    display(ctx, guild_id).await;
                    if result {
                        dbg!("running show_games");
                        show_games(ctx, guild_id).await;
                    }
                }
            }
        }
        Err(err) => {
            let resp = msg
                .reply_mention(&ctx.http, &format!("Error: {}", err))
                .await?;
            sleep(Duration::from_secs(3)).await;
            resp.delete(&ctx.http).await?;
        }
    }
    msg.delete(&ctx.http).await?;
    Ok(())
}

#[command]
pub async fn leave(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    match check_queue_channel(ctx, msg).await {
        Ok(value) => {
            if value {
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
                        let data = ctx.data.read().await;
                        let queue = data.get::<QueueManager>().unwrap();
                        let mut queue = queue.lock().await;
                        queue.leave_queue(msg.author.id, &role);
                    }
                    let guild_id = msg.guild_id.unwrap();
                    display(ctx, guild_id).await;
                    // Calling the show_games function with the context and guild_id.
                    // show_games(&ctx, guild_id).await;
                }
            }
        }
        Err(err) => {
            let resp = msg
                .reply_mention(&ctx.http, &format!("Error: {}", err))
                .await?;
            sleep(Duration::from_secs(3)).await;
            resp.delete(&ctx.http).await?;
        }
    }
    Ok(())
}

#[command]
pub async fn won(ctx: &Context, msg: &Message) -> CommandResult {
    match check_queue_channel(ctx, msg).await {
        Ok(value) => {
            if value {
                let user = msg.author.id;
                let game;
                {
                    let data = ctx.data.read().await;
                    let queue = data.get::<QueueManager>().unwrap().lock().await;
                    game = queue.get_side(user).await.clone();
                }
                let guild_id = msg.guild_id.unwrap();
                let channel_id = msg.channel_id;
                let response = channel_id
        .say(
            &ctx.http,
            format!(
                "{} has started a vote to score the winner of Game {} as {}. React with a ✅ to vote for the game's outcome.\nI'll wait for 180 seconds for the required 6+ votes.",
                user.mention(),
                game.0,
                game.1,
            ),
        )
        .await?;
                response.react(&ctx.http, '✅').await?;
                let mut collector = EventCollectorBuilder::new(&ctx)
                    .add_event_type(EventType::ReactionAdd)
                    .add_event_type(EventType::ReactionRemove)
                    .add_message_id(response.id)
                    .timeout(Duration::from_secs(180))
                    .build()
                    .unwrap();
                let mut votes = 0;
                while let Some(event) = collector.next().await {
                    match event.as_ref() {
                        Event::ReactionAdd(reaction) => {
                            if reaction.reaction.emoji == ReactionType::Unicode(String::from("✅"))
                            {
                                votes += 1;
                                if votes >= 6 {
                                    let response = channel_id
                                        .say(
                                            &ctx.http,
                                            format!(
                                    "Vote to confirm the game's outcome has passed. The game will be scored."
                                ),
                                        )
                                        .await?;
                                    sleep(Duration::from_secs(3)).await;
                                    response.delete(&ctx.http).await?;
                                    //TODO win function in queue manager
                                    let mentions;
                                    {
                                        let data = ctx.data.read().await;
                                        let queue = data.get::<QueueManager>().unwrap();
                                        let queue = queue.lock().await;
                                        mentions = queue.requeue_players(game.0).await;                 
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
                                                if reaction.reaction.emoji == ReactionType::Unicode(String::from("❌")) {
                                                    dont_queue.push(reaction.reaction.user_id.unwrap());
                                                }
                                            },
                                            Event::ReactionRemove(reaction) => {
                                                if reaction.reaction.emoji == ReactionType::Unicode(String::from("❌")) {
                                                    dont_queue.swap_remove(dont_queue.iter().position(|&x| x == reaction.reaction.user_id.unwrap()).unwrap());
                                                }
                                            }
                                            _ =>{}
                                        }
                                    }
                                    {
                                        let data = ctx.data.read().await;
                                        let queue = data.get::<QueueManager>().unwrap();
                                        let mut queue = queue.lock().await;
                                        queue.win(game, ctx, channel_id, dont_queue).await;
                                    }
                                    display(ctx, guild_id).await;
                                    break;
                                }
                            }
                        }
                        Event::ReactionRemove(reaction) => {
                            if reaction.reaction.emoji == ReactionType::Unicode(String::from("✅"))
                            {
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
                            format!(
                                "Vote to confirm game's outcome has failed. The game will not be scored, please try again."
                            ),
                        )
                        .await?;
                    sleep(Duration::from_secs(3)).await;
                    response.delete(&ctx.http).await?;
                }
                response.delete(&ctx.http).await?;
            }
        }
        Err(e) => {
            let resp = msg
                .reply_mention(&ctx.http, &format!("Error: {}", e))
                .await?;
            sleep(Duration::from_secs(3)).await;
            resp.delete(&ctx.http).await?;
        }
    }
    msg.delete(&ctx.http).await?;
    Ok(())
}

#[command]
pub async fn cancel(ctx: &Context, msg: &Message) -> CommandResult {
    match check_queue_channel(ctx, msg).await {
        Ok(value) => {
            if value {
                let user = msg.author.id;
                let result;
                {
                    let data = ctx.data.read().await;
                    let queue = data.get::<QueueManager>().unwrap();
                    let mut queue = queue.lock().await;
                    let queue_channel = *data.get::<QueueChannel>().unwrap().lock().await;
                    result = queue.cancel_game(user, ctx, queue_channel).await;
                }
                if result {
                    let response = msg
                        .channel_id
                        .say(
                            &ctx.http,
                            format!(
                                "Game cancelled by {}\nThey will not be added back to the queue.",
                                msg.author.mention()
                            ),
                        )
                        .await?;
                    sleep(Duration::from_secs(3)).await;
                    response.delete(&ctx.http).await?;
                    let guild_id = msg.guild_id.unwrap();
                    let result;
                    {
                        let data = ctx.data.read().await;
                        let mut queue = data.get::<QueueManager>().unwrap().lock().await;
                        result = queue.check_for_game().await;
                    }
                    display(ctx, guild_id).await;
                    if result {
                        show_games(ctx, guild_id).await;
                    }
                }
            }
        }
        Err(err) => {
            let resp = msg
                .reply_mention(&ctx.http, &format!("Error: {}", err))
                .await?;
            sleep(Duration::from_secs(3)).await;
            resp.delete(&ctx.http).await?;
        }
    }
    msg.delete(&ctx.http).await?;
    Ok(())
}

#[command]
#[aliases("clear")]
pub async fn vote_clear(ctx: &Context, msg: &Message) -> CommandResult {
    match check_queue_channel(ctx, msg).await {
        Ok(value) => {
            if value {
                let channel_id;
                {
                    let data = ctx.data.read().await;
                    channel_id = *data.get::<QueueChannel>().unwrap().lock().await;
                }
                let response = channel_id
        .say(
            &ctx.http,
            format!(
                "Vote to clear the queue has started. React with a ✅ to vote to clear the queue.\nI'll wait for 60 seconds for the required 6+ votes."
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
                            if reaction.reaction.emoji == ReactionType::Unicode(String::from("✅"))
                            {
                                votes += 1;
                                if votes >= 6 {
                                    let response = channel_id
                                        .say(
                                            &ctx.http,
                                            format!(
                                    "Vote to clear the queue has passed. The queue will be cleared."
                                ),
                                        )
                                        .await?;
                                    sleep(Duration::from_secs(3)).await;
                                    response.delete(&ctx.http).await?;
                                    let guild_id = msg.guild_id.unwrap();
                                    {
                                        let data = ctx.data.read().await;
                                        let mut queue =
                                            data.get::<QueueManager>().unwrap().lock().await;
                                        queue.clear_queue().await;
                                    }
                                    display(ctx, guild_id).await;
                                    break;
                                }
                            }
                        }
                        Event::ReactionRemove(reaction) => {
                            if reaction.reaction.emoji == ReactionType::Unicode(String::from("✅"))
                            {
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
                            format!(
                                "Vote to clear the queue has failed. The queue will not be cleared."
                            ),
                        )
                        .await?;
                    sleep(Duration::from_secs(3)).await;
                    response.delete(&ctx.http).await?;
                }
                response.delete(&ctx.http).await?;
            }
        }
        Err(err) => {
            let resp = msg
                .reply_mention(&ctx.http, &format!("Error: {}", err))
                .await?;
            sleep(Duration::from_secs(3)).await;
            resp.delete(&ctx.http).await?;
        }
    }
    msg.delete(&ctx.http).await?;
    Ok(())
}

#[command]
#[aliases("remove")]
pub async fn vote_remove(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    match check_queue_channel(ctx, msg).await {
        Ok(value) => {
            if value {
                if args.len() != 1 {
                    let response = msg
                        .reply_mention(&ctx.http, "Usage: !vote remove @user")
                        .await?;
                    sleep(Duration::from_secs(3)).await;
                    response.delete(&ctx.http).await?;
                    msg.delete(&ctx.http).await?;
                    return Ok(());
                }
                let show_user = args.single::<String>().unwrap();
                let user = show_user.replace("<@", "").replace(">", "");
                let user = user.parse::<UserId>().unwrap();
                if user == msg.author.id {
                    let response = msg.reply_mention(&ctx.http, "🦛🦛🦛🦛🦛🦛🦛🦛🦛🦛🦛").await?;
                    sleep(Duration::from_secs(3)).await;
                    response.delete(&ctx.http).await?;
                    leave(ctx, msg, args);
                    msg.delete(&ctx.http).await?;
                    return Ok(());
                }
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
                        show_user,
                        msg.author.mention()
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
                            if reaction.reaction.emoji == ReactionType::Unicode(String::from("✅"))
                            {
                                votes += 1;
                                if votes >= 6 {
                                    let response = channel_id
                                    .say(
                                        &ctx.http,
                                        format!(
                                            "Vote to kick has passed. {} will be removed from the queue.",
                                            show_user
                                        ),
                                    )
                                    .await?;
                                    sleep(Duration::from_secs(3)).await;
                                    response.delete(&ctx.http).await?;
                                    let guild_id = msg.guild_id.unwrap();
                                    {
                                        let data = ctx.data.read().await;
                                        let mut queue =
                                            data.get::<QueueManager>().unwrap().lock().await;
                                        queue.leave_queue(user, "");
                                    }
                                    display(ctx, guild_id).await;
                                    break;
                                }
                            }
                        }
                        Event::ReactionRemove(reaction) => {
                            if reaction.reaction.emoji == ReactionType::Unicode(String::from("✅"))
                            {
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
                            format!(
                                "Vote to clear the queue has failed. The queue will not be cleared."
                            ),
                        )
                        .await?;
                    sleep(Duration::from_secs(3)).await;
                    response.delete(&ctx.http).await?;
                }
                response.delete(&ctx.http).await?;
            }
        }
        Err(err) => {
            let resp = msg
                .reply_mention(&ctx.http, &format!("Error: {}", err))
                .await?;
            sleep(Duration::from_secs(3)).await;
            resp.delete(&ctx.http).await?;
        }
    }
    msg.delete(&ctx.http).await?;
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
        let queue = queue.lock().await;
        queue_channel = *data.get::<QueueChannel>().unwrap().lock().await;
        if let Some(missing) = queue.get_missing_roles().await {
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
            } else if missing_roles != "A test string" {
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
}

#[async_recursion]
pub async fn show_games(ctx: &Context, guild_id: GuildId) {
    let tentative_games;
    let queue_channel;
    {
        let data = ctx.data.read().await;
        let queue = data.get::<QueueManager>().unwrap();
        let queue = queue.lock().await;
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
                let data = ctx.data.read().await;
                let queue = data.get::<QueueManager>().unwrap();
                let mut queue = queue.lock().await;
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
            dbg!("stuck waitin");
            let mut game_ready = false;
            'collector: while let Some(event) = collector.next().await {
                dbg!("didn't even make it");
                match event.as_ref() {
                    Event::ReactionAdd(e) => {
                        let reaction = &e.reaction;
                        dbg!("{:?}", &reaction.emoji);
                        let result;
                        {
                            let data = ctx.data.read().await;
                            let queue = data.get::<QueueManager>().unwrap();
                            let mut queue = queue.lock().await;
                            result = queue
                                .update_status(reaction.user_id.unwrap(), &reaction.emoji, game.0)
                                .await;
                        }
                        dbg!(&result);
                        match result {
                            Ok(_) => {
                                let body;
                                {
                                    let data = ctx.data.read().await;
                                    let queue = data.get::<QueueManager>().unwrap();
                                    let queue = queue.lock().await;
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
                            let data = ctx.data.read().await;
                            let queue = data.get::<QueueManager>().unwrap();
                            let mut queue = queue.lock().await;
                            result = queue
                                .unready(reaction.user_id.unwrap(), &reaction.emoji, game.0)
                                .await;
                        }
                        if result {
                            let body;
                            {
                                let data = ctx.data.read().await;
                                let queue = data.get::<QueueManager>().unwrap();
                                let queue = queue.lock().await;
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
                    let data = ctx.data.read().await;
                    let queue = data.get::<QueueManager>().unwrap();
                    let queue = queue.lock().await;
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
                    let queue = data.get::<QueueManager>().unwrap();
                    let mut queue = queue.lock().await;
                    let prefix = data.get::<Prefix>().unwrap();
                    let riot = data.get::<Riot>().unwrap();
                    queue
                        .start_game(
                            &game.0,
                            ctx,
                            queue_channel,
                            message_id,
                            guild_id,
                            prefix,
                            riot,
                        )
                        .await;
                }
            } else {
                dbg!("adding players back to queue");
                let result;
                {
                    let data = ctx.data.read().await;
                    let queue = data.get::<QueueManager>().unwrap();
                    let mut queue = queue.lock().await;
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

async fn check_queue_channel<'a>(ctx: &'a Context, msg: &'a Message) -> Result<bool, &'a str> {
    {
        let data = ctx.data.read().await;
        let channel_id = *data.get::<QueueChannel>().unwrap().lock().await;
        if channel_id == ChannelId(0) {
            return Err("Queue channel not set");
        }
        if channel_id != msg.channel_id {
            return Ok(false);
        }
    }
    Ok(true)
}
