# Custom Inhouse Bot

## Todo

1. QoL Changes
   1. Buttons for queuing up alongside the commands


## Rules for the bot

1. A player can be in no more than two roles at a time.
2. Rating is dependent on the queued role.
3. No swapping roles once the game is accepted
4. MMR is dependent on the ELO of player

## Documentation and other notes

- How to run
  - .env file
    - DISCORD_TOKEN=<Your bot's token>
    - RGAPI_KEY=\<Your Riot Api key>
    - POSTGRES_PASSWORD=<Don't use the default>
    - DATABASE_URL=\<Pointing to a valid Postgres DB named mochi>
    - LOADING_EMOJI=\<ID of Discord emoji>
      - Use \\\<emoji> to get the id
      - \<a:loading:11112222333444> - example id
  - Diesel CLI
    - The project requires the Diesel CLI to run and setup the migrations for the DB
  - Makefile
    - run
      - Loads env variables and runs bot using cargo
    - migrate
      - Used with the Diesel CLI
    - revert
      - Used with the Diesel CLI
    - generate
      - Used with the Diesel CLI
  - Docker Compose
    - Docker compose file is included for easy setup
- Requires these perms in Discord
  - Read Messages/View Channels
  - Send Messages
  - Embed Links
  - Add Reactions
  - Read Message History
  - Manage Messages
- all commands with the "/admin" require the user to be an Administrator
- Command Groups
  - General
    - queue
      - Usage: /queue \<role>
    - leave
      - Usage: /leave
    - register
      - Sends registration info in DM's
      - All logic is done in DM's. Nothing will be shown in server channels.
      - Same as MSL register, but with fewer restrictions to pass
    - won
      - Confirm a game as won and start vote
    - cancel
      - Cancel a game that was confirmed
    - clear
      - Create a vote to clear the queue
    - remove
      - Usage: /remove @player
      - Create a vote to remove a player from the queue
  - Admin
    - mark
      - Sets the current channel to be the queue channel
    - unmark
      - Removes the current channel from being the queue channel
    - setemojis
      - Usage: /admin setemojis \<topEmoji> \<jgEmoji> \<midEmoji> \<botEmoji> \<supEmoji>
    - clear
      - Clear the queue without a vote
    - remove
      - Usage: /admin remove @player
      - Remove a player without a vote
