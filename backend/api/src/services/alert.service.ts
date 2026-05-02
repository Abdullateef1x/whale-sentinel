import axios from "axios";

export const sendTelegramAlert = async (signal: any) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  const message = `
🐋 *Whale Signal Detected*

📊 Token: ${signal.token}
📈 Signal: ${signal.signal}
🔥 Confidence: ${(signal.confidence * 100).toFixed(0)}%
🧠 Reason: ${signal.reason}
  `;

  await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
    chat_id: chatId,
    text: message,
    parse_mode: "Markdown",
  });
};


export const sendDiscordAlert = async (signal: any) => {
  const webhook = process.env.DISCORD_WEBHOOK_URL;

  if (!webhook) return;

  await axios.post(webhook, {
    embeds: [
      {
        title: "🐋 Whale Signal Detected",
        color: signal.signal === "BUY" ? 0x00ff00 : 0xff0000,
        fields: [
          { name: "Token", value: signal.token, inline: true },
          { name: "Signal", value: signal.signal, inline: true },
          {
            name: "Confidence",
            value: `${(signal.confidence * 100).toFixed(0)}%`,
            inline: true,
          },
          { name: "Reason", value: signal.reason },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  });
};