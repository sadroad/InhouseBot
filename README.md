# Custom Inhouse Bot

## Implementation steps

1. The ability for players to queue - Here
2. Register summoner names for discord accounts
3. Save player data
   1. Postgresql database

4. Create teams based on queued players
5. Allow players to accept and decline matches
6. Create an Elo system for better matchmaking

## Rules for the bot

1. A player can be in no more than two roles at a time
2. Rating is dependent on the queued role
3. No swapping roles once the game is accepted
4. MMR is dependent on the ELO of player

## Documentation and other notes

- Requires these perms
  - Read Messages/View Channels
  - Send Messages
  - Embed Links
  - Add Reactions
  - Read Message History
  - Manage Messages
- Command prefix looks for ENV variable PREFIX, else defaults to "!"
- all commands with the "\<prefix>admin" require the user to be an Administrator
- Command Groups
  - General
    - queue
      - Usage: \<prefix>queue \<role>
    - leave
      - Usage: \<prefix>leave
    - register \<account name>
      - Sends registration info in DM's
      - 
  - Admin
    - mark
      - Sets the current channel to be the queue channel
    - unmark
      - Removes the current channel from being the queue channel
