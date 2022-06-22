
FROM rust:1.61 AS builder
RUN USER=root cargo new --bin bot
WORKDIR /bot
COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml
RUN cargo build --release && rm src/*.rs
COPY ./src ./src
RUN rm ./target/release/deps/bot*
RUN cargo build --release

FROM debian:buster-slim
COPY --from=builder /bot/target/release/bot /usr/src/bot
CMD ["/usr/src/bot"]