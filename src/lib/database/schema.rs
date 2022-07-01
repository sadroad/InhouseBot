table! {
    game_roles (id) {
        id -> Int4,
        discord_id -> Int8,
        game_id -> Int4,
        role -> Text,
        blue_side -> Bool,
    }
}

table! {
    games (id) {
        id -> Int4,
        players -> Array<Int8>,
    }
}

table! {
    player (discord_id) {
        discord_id -> Int8,
        accounts -> Array<Text>,
    }
}

table! {
    player_ratings (discord_id) {
        discord_id -> Int8,
        mu -> Float8,
        sigma -> Float8,
    }
}

table! {
    server_information (id) {
        id -> Int4,
        queue_channel -> Int8,
        command_channel -> Int8,
        top_emoji -> Text,
        jungle_emoji -> Text,
        mid_emoji -> Text,
        bot_emoji -> Text,
        sup_emoji -> Text,
    }
}

joinable!(game_roles -> games (game_id));
joinable!(game_roles -> player (discord_id));
joinable!(player_ratings -> player (discord_id));

allow_tables_to_appear_in_same_query!(
    game_roles,
    games,
    player,
    player_ratings,
    server_information,
);
