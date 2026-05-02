use futures::StreamExt;
use solana_client::nonblocking::pubsub_client::PubsubClient;
use solana_client::rpc_config::{RpcTransactionLogsConfig, RpcTransactionLogsFilter};
use solana_sdk::commitment_config::CommitmentConfig;
use std::env;

use crate::services::whale_tracker::process_log;

pub async fn start_listener() {
    let ws_url = env::var("RPC_WS_URL").expect("Missing RPC_WS_URL");

    let client = PubsubClient::new(&ws_url).await.expect("Failed to connect");
    let (receiver, subscription) = client
        .logs_subscribe(
            RpcTransactionLogsFilter::All,
            RpcTransactionLogsConfig {
                commitment: Some(CommitmentConfig::confirmed()),
            },
        )
        .await
        .expect("Failed to subscribe to logs");

    println!("👂 Listening to Solana logs...");

    futures::pin_mut!(receiver);
    while let Some(log) = receiver.next().await {
        process_log(log.value).await;
    }

    (subscription)().await;
}



