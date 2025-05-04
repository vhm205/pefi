const serverless = require("serverless-http");
const express = require("express");
const app = express();

const { HOST, TELEGRAM_API_URL, TELEGRAM_BOT_TOKEN } = require("./config");

const {
  sendTelegramMessage,
  handleText,
  handleVoice,
  handleCallbackQuery,
} = require("./utils");

app.use(express.json());

app.get("/", (req, res) => {
  console.log({ HOST });
  const host = req.headers.host || HOST;
  const protocol = req.protocol === "https" ? "https" : "http";
  const serverURL = `${protocol}://${host}`;

  res.json({
    message: "Welcome to the Telegram Bot API",
    status: "success",
    config: {
      TELEGRAM_API_URL,
      HOST,
      serverURL,
    },
  });
});

// Telegram webhook endpoint
app.post("/telegram/:token", async (req, res) => {
  const token = req.params.token;

  // Verify the token matches your bot token
  if (token !== TELEGRAM_BOT_TOKEN) {
    return res.status(401).json({ message: "Unauthorized", error: true });
  }

  try {
    // Parse the update from Telegram
    const { message, callback_query } = req.body;

    if (callback_query) {
      const { message, data } = callback_query;
      const chatId = message.chat.id;
      const messageId = message.message_id;
      const text = message.text;

      await handleCallbackQuery(data, chatId, messageId, text);
    }

    if (message) {
      const { voice, chat, text } = message;
      const chatId = chat.id;
      const messageText = text || "";

      if (voice) {
        await handleVoice(voice, chatId);
      } else {
        await handleText(messageText, chatId);
      }
    }

    return res.json({ status: "success" });
  } catch (error) {
    console.error("Error handling Telegram webhook:", error);
    await sendTelegramMessage(
      TELEGRAM_BOT_TOKEN,
      chatId,
      "❌ Failed to process your message. Please try again.",
    );
    return res
      .status(500)
      .json({ message: "Failed to process webhook", error });
  }
});

// Setup Telegram webhook
app.get("/setup-webhook", async (req, res) => {
  try {
    const host = req.headers.host || HOST;
    const protocol = req.protocol === "https" ? "https" : "http";
    const webhookUrl = `${protocol}://${host}/telegram/${TELEGRAM_BOT_TOKEN}`;
    console.log("Setting webhook URL:", webhookUrl);

    const response = await fetch(
      `${TELEGRAM_API_URL}/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}`,
      {
        method: "GET",
      },
    );

    const result = await response.json();
    return res.json(result);
  } catch (error) {
    console.error("Error setting webhook:", error);
    return res.status(500).json({ message: "Failed to set webhook", error });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
