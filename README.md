# Custom Inhouse Bot

## Implementation steps

1. The ability for players to queue - Done
2. Register summoner names for discord accounts - Here
3. Save player data
   1. Postgresql database

4. Create teams based on queued players
5. Allow players to accept and decline matches.
6. Create an Elo system for better matchmaking
7. QoL Changes
   1. Buttons for queuing up alongside the commands
   2. Ephemeral Messages instead of pings or mentions
      1. https://docs.rs/serenity/0.11.2/serenity/builder/struct.CreateInteractionResponseFollowup.html#method.ephemeral


## Rules for the bot

1. A player can be in no more than two roles at a time.
2. Rating is dependent on the queued role.
3. No swapping roles once the game is accepted
4. MMR is dependent on the ELO of player

## Documentation and other notes

- How to run
  - .env file
    - PREFIX=<prefix you would like defaults to "!">
    - DISCORD_TOKEN=<Your bot's token>
    - RGAPI_KEY=\<Your Riot Api key>
  - Instead of cargo run, use make run
    - Loads .env variables into a local instance of the environment for the command
- Requires these perms in Discord
  - Read Messages/View Channels
  - Send Messages
  - Embed Links
  - Add Reactions
  - Read Message History
  - Manage Messages
- all commands with the "\<prefix>admin" require the user to be an Administrator
- Command Groups
  - General
    - queue
      - Usage: \<prefix>queue \<role>
    - leave
      - Usage: \<prefix>leave
    - register
      - Sends registration info in DM's
      - All logic is done in DM's. Nothing will be shown in server channels.
      - Same as MSL register, but with fewer restrictions to pass
  - Admin
    - mark
      - Sets the current channel to be the queue channel
    - unmark
      - Removes the current channel from being the queue channel
    - role_emojis
      - Alias: roleEmojis
      - Usage: .admin roleEmojis \<topEmoji> \<jgEmoji> \<midEmoji> \<botEmoji> \<supEmoji>
