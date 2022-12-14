use crate::lib::inhouse::get_msl_points;
use crate::{Riot, QUEUE_MANAGER};
use riven::consts::PlatformRoute::NA1;
use riven::RiotApi;
use serenity::model::application::interaction::application_command::ApplicationCommandInteraction;
use serenity::model::application::interaction::InteractionResponseType;
use serenity::prelude::*;
use tokio::time::{sleep, Duration};

use tracing::log::info;

pub async fn ping(
    ctx: &Context,
    command: &ApplicationCommandInteraction,
) -> Result<(), SerenityError> {
    command
        .create_interaction_response(&ctx.http, |response| {
            response
                .kind(InteractionResponseType::ChannelMessageWithSource)
                .interaction_response_data(|message| message.ephemeral(true).content("Pong!"))
        })
        .await
}

pub async fn register(
    ctx: &Context,
    command: &ApplicationCommandInteraction,
) -> Result<(), SerenityError> {
    let author = &command.member.as_ref().unwrap().user;
    {
        let queue = QUEUE_MANAGER.read().await;
        let player = author.id;
        if let Err(e) = queue.check_registered_player(player) {
            return command
                .create_interaction_response(&ctx.http, |response| {
                    response
                        .kind(InteractionResponseType::ChannelMessageWithSource)
                        .interaction_response_data(|message| {
                            message.ephemeral(true).content(&format!("Error: {}", e))
                        })
                })
                .await;
        }
    }
    command.defer(&ctx.http).await.unwrap();
    command
        .delete_original_interaction_response(&ctx.http)
        .await
        .unwrap();
    info!("User registering: {}", &author.name);
    let dm = author
        .direct_message(
            &ctx.http,
            |m| m.content("\nReply below with a list of all level 30+ accounts separated by a comma. Place the account you will be playing on first\n*Example*: sadroad,Metashift,MetaSoren")
        )
        .await?;
    let accounts;
    if let Some(response) = dm
        .channel_id
        .await_reply(ctx)
        .timeout(Duration::from_secs(60))
        .await
    {
        accounts = response.content.to_string();
        dm.delete(&ctx.http).await?;
    } else {
        let resp = dm
            .channel_id
            .say(&ctx.http, "No response received. Cancelling registration.")
            .await?;
        sleep(Duration::from_secs(3)).await;
        dm.delete(&ctx.http).await?;
        resp.delete(&ctx.http).await?;
        return Ok(());
    }
    let accounts = accounts
        .split(',')
        .map(|x| x.trim().to_string())
        .collect::<Vec<String>>();
    let dm = dm
        .channel_id
        .say(&ctx.http, "Calculating initial rating...")
        .await?;
    let mut puuids: Vec<(String, String, String, i32)> = Vec::new(); // (name, puuid)
    let riot_key;
    {
        let data = ctx.data.read().await;
        riot_key = data.get::<Riot>().unwrap().to_string();
    }
    let riot_api = RiotApi::new(&riot_key);
    for account in accounts {
        let account = account.to_string();
        if let Ok(summoner) = riot_api
            .summoner_v4()
            .get_by_summoner_name(NA1, &account)
            .await
        {
            if let Some(summoner) = summoner {
                puuids.push((
                    summoner.name,
                    summoner.puuid,
                    summoner.id,
                    summoner.summoner_level.try_into().unwrap(),
                ));
            } else {
                let response = dm
                    .channel_id
                    .say(&ctx.http, &format!("{} is not a valid summoner.", account))
                    .await?;
                sleep(Duration::from_secs(3)).await;
                response.delete(&ctx.http).await?;
            }
        } else {
            if let Err(err) = riot_api
                .summoner_v4()
                .get_by_summoner_name(NA1, &account)
                .await
            {
                info!("Riot Api Error: {}", err);
            }
            let response = dm
                .channel_id
                .say(
                    &ctx.http,
                    "Something seems to be wrong with the API, please notify sadroad#0001",
                )
                .await?;
            sleep(Duration::from_secs(10)).await;
            response.delete(&ctx.http).await?;
            return Ok(());
        }
    }
    let mut riot_accounts: Vec<String> = Vec::new();
    let mut opgg_list: Vec<(String, String, i32)> = Vec::new();
    for (name, puuid, id, level) in puuids {
        let queue = QUEUE_MANAGER.read().await;
        if queue.check_puuid(&puuid).is_err() {
            let response = dm
                .channel_id
                .say(
                    &ctx.http,
                    &format!(
                        "{} has already been registered. If this is an issue, contact an admin",
                        name
                    ),
                )
                .await?;
            sleep(Duration::from_secs(5)).await;
            response.delete(&ctx.http).await?;
            continue;
        }
        riot_accounts.push(puuid.to_string());
        opgg_list.push((name, id, level));
    }
    let msl_simga_value = match get_msl_points(opgg_list, &riot_key).await {
        Ok(points) => points,
        Err(e) => {
            let response = dm
                .channel_id
                .say(&ctx.http, &format!("Error: {}", e))
                .await?;
            sleep(Duration::from_secs(3)).await;
            response.delete(&ctx.http).await?;
            dm.delete(&ctx.http).await?;
            return Ok(());
        }
    };
    dm.delete(&ctx.http).await?;
    if riot_accounts.is_empty() {
        let response = dm
            .channel_id
            .say(
                &ctx.http,
                &format!("No accounts for successful registration {}", author.name),
            )
            .await?;
        sleep(Duration::from_secs(3)).await;
        response.delete(&ctx.http).await?;
        return Ok(());
    }
    {
        let mut queue = QUEUE_MANAGER.write().await;
        let player = author.id;
        queue.register_player(player, riot_accounts, msl_simga_value);
    }
    let response = dm
        .channel_id
        .say(
            &ctx.http,
            &format!("Successfully registered {}", author.name),
        )
        .await?;
    sleep(Duration::from_secs(3)).await;
    response.delete(&ctx.http).await?;
    Ok(())
}
