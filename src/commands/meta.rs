use serenity::framework::standard::{CommandResult, macros::command,CommandError};
use serenity::model::prelude::*;
use serenity::prelude::*;
use tokio::time::{sleep, Duration};
use crate::{QueueManager, Riot};
use crate::lib::inhouse::get_msl_points;
use riven::consts::PlatformRoute::NA1;
use riven::RiotApi;

use tracing::log::info;

#[command]
pub async fn ping(ctx: &Context, msg: &Message) -> CommandResult {
    msg.channel_id.say(&ctx.http, "Pong!").await?;
    Ok(())
}

#[command]
pub async fn register(ctx: &Context, msg: &Message) -> CommandResult {
    //TODO register in the queue doesn't send a DM
    let author = &msg.author;
    {
        let data = ctx.data.read().await;
        let queue = data.get::<QueueManager>().unwrap();
        let mut queue = queue.lock().await;
        let player = msg.author.id;
        if let Err(e) = queue.check_registered_player(player){
            let response = msg.reply_mention(&ctx.http, &format!("Error: {}", e)).await?;
            sleep(Duration::from_secs(3)).await;
            response.delete(&ctx.http).await?;
            msg.delete(&ctx.http).await?;
            return Ok(());
        }
    }
    dbg!(&author.name);
    msg.delete(&ctx.http).await?;
    let dm = author
        .direct_message(
            &ctx.http,
            |m| m.content("\nReply below with a list of all level 30+ accounts separated by a comma.\n*Example*: sadroad,Metashift,MetaSoren")
        )
        .await?;
    let accounts;
    if let Some(response) = dm
        .channel_id
        .await_reply(&ctx)
        .timeout(Duration::from_secs(60))
        .await
    {
        accounts = response.content.to_string();
        // dm.delete(&ctx.http).await?;
    } else {
        dm.channel_id.say(&ctx.http, "No response received. Cancelling registration.").await?;
        return Ok(());
    }
    let accounts = accounts.split(',').map(|x| x.trim().to_string()).collect::<Vec<String>>();
    let dm = dm.channel_id.say(&ctx.http, "Calculating initial rating...").await?;
    let mut puuids: Vec<(String,String,String,i64)> = Vec::new(); // (name, puuid)
    let riot_key;
    {
        let data = ctx.data.read().await;
        riot_key = data.get::<Riot>().unwrap().to_string();
    }
    let riot_api = RiotApi::new(&riot_key);
    for account in accounts {
        let account = account.to_string();
        if let Ok(summoner) = riot_api.summoner_v4()
            .get_by_summoner_name(NA1, &account).await
        {
            if let Some(summoner) = summoner{
                puuids.push((summoner.name,summoner.puuid,summoner.id,summoner.summoner_level));
            } else {
                let response = dm.channel_id.say(&ctx.http, &format!("{} is not a valid summoner.", account)).await?;
                sleep(Duration::from_secs(3)).await;
                response.delete(&ctx.http).await?;
            }
        } else {
            let response = dm.channel_id.say(&ctx.http, &format!("Something seems to be wrong with the API, please notify sadroad#0001")).await?;
            sleep(Duration::from_secs(10)).await;
            response.delete(&ctx.http).await?;
            return Ok(());
        }
    }
    let mut riot_accounts: Vec<String> = Vec::new();
    let mut opgg_list: Vec<(String,String,i64)> = Vec::new();
    for (name,puuid,id,level) in puuids{
        let data = ctx.data.read().await;
        let queue = data.get::<QueueManager>().unwrap();
        let queue = queue.lock().await;
        if let Err(_) = queue.check_puuid(&puuid){
            let response = dm.channel_id.say(&ctx.http, &format!("{} has already been registered. If this is an issue, contact an admin",name)).await?;
            sleep(Duration::from_secs(5)).await;
            response.delete(&ctx.http).await?;
            continue;
        }
        riot_accounts.push(puuid.to_string());
        opgg_list.push((name,id,level));
    }
    let msl_sigma_value = get_msl_points(opgg_list,&riot_key).await;
    info!("Estimate MSL Points {}",msl_sigma_value.unwrap());
    dm.delete(&ctx.http).await?;
    Ok(())
}