use serde_json::json;
use std::env;

pub async fn process_log(log: solana_client::rpc_response::RpcLogsResponse) {
    let threshold: u64 = env::var("WHALE_THRESHOLD")
        .unwrap_or("10000000000".to_string())
        .parse()
        .unwrap();

    // Basic detection: look for transfer logs
    for entry in log.logs {
        if entry.contains("transfer") {
            // 🚨 VERY SIMPLE PARSER (we improve later)
            if entry.contains("lamports") {
                println!("💸 Possible transfer: {}", entry);

                // Fake detection logic for MVP
                let detected_amount = 15_000_000_000; // simulate > threshold

                if detected_amount > threshold {
                    println!("🐋 WHALE DETECTED!");

                    send_whale_signal(detected_amount).await;
                }
            }
        }
    }
}

async fn send_whale_signal(amount: u64) {
    let api_url = env::var("API_ENDPOINT").expect("Missing API_ENDPOINT");

    let client = reqwest::Client::new();

    let payload = json!({
        "type": "WHALE_BUY",
        "amount": amount,
        "token": "SOL",
        "confidence": 0.75
    });

    match client.post(api_url).json(&payload).send().await {
        Ok(_) => println!("📡 Signal sent to API"),
        Err(e) => println!("❌ Failed to send signal: {:?}", e),
    }
}