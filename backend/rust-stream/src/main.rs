mod services;
mod utils;
mod config;

use dotenvy::dotenv;

#[tokio::main]
async fn main() {
    dotenv().ok();

    println!("🚀 Starting Solana Whale Tracker...");

    services::solana_listener::start_listener().await;
}