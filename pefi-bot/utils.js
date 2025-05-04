const fs = require("node:fs");
const { promisify } = require("node:util");

const axios = require("axios");
const ffmpeg = require("fluent-ffmpeg");
const OpenAI = require("openai");

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

const {
  API_URL,
  API_KEY,
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_API_URL,
  OPENAI_API_KEY,
} = require("./config");

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const headers = {
  Authorization: `Bearer ${API_KEY}`,
};

const getSchemaStructure = (data) => {
  return {
    format: {
      type: "json_schema",
      name: "create_new_transaction",
      schema: {
        type: "object",
        properties: {
          type: {
            type: "string",
            description: "The type of transaction. Default is expense.",
            enum: ["income", "expense", "transfer"],
          },
          description: {
            type: "string",
            description: "Description of the transaction.",
          },
          note: {
            type: "string",
            description: "Note for the transaction. Optional.",
          },
          amount: {
            type: "number",
            description: "The amount spent on transaction.",
          },
          method: {
            type: "string",
            description: "The payment method used for the transaction.",
            enum: data && data?.methods,
          },
          category: {
            type: "string",
            description: "Category of the transaction.",
            enum: data && data?.categories,
          },
          fund: {
            type: "string",
            description: "The fund or source of the transaction.",
            enum: data && data?.funds,
          },
        },
        required: [
          "type",
          "amount",
          "method",
          "category",
          "fund",
          "description",
          "note",
        ],
        additionalProperties: false,
      },
      strict: true,
    },
  };
};

// Helper function to send messages to Telegram
async function sendTelegramMessage(token, chatId, text, reply_markup = {}) {
  const url = `${TELEGRAM_API_URL}/bot${token}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      ...reply_markup,
    }),
  });

  return response.json();
}

// Helper function to edit messages in Telegram
async function editTelegramMessage(
  token,
  chatId,
  messageId,
  newText,
  reply_markup = {},
) {
  const url = `${TELEGRAM_API_URL}/bot${token}/editMessageText`;
  const body = {
    chat_id: chatId,
    message_id: messageId,
    text: newText,
    ...(reply_markup && Object.keys(reply_markup).length
      ? { reply_markup }
      : {}),
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return response.json();
}

async function sendTranscriptionWithButtons(chatId, event) {
  // const message = `📝 Transcription: ${transcription}\n\nParsed Transaction:\n${JSON.stringify(event, null, 2)}`;

  await sendTelegramMessage(
    TELEGRAM_BOT_TOKEN,
    chatId,
    JSON.stringify(event, null, 2),
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Accept", callback_data: "accept_transaction" },
            { text: "❌ Reject", callback_data: "reject_transaction" },
          ],
          // [{ text: "🔕 Don't ask next time", callback_data: 'dont_ask_next_time' }],
        ],
      },
    },
  );
}

async function getVoiceFileLink(fileId) {
  try {
    const response = await axios.get(
      `${TELEGRAM_API_URL}/bot${TELEGRAM_BOT_TOKEN}/getFile`,
      {
        params: {
          file_id: fileId,
        },
      },
    );

    if (response.data.ok) {
      const filePath = response.data.result.file_path;
      const fileUrl = `${TELEGRAM_API_URL}/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
      return fileUrl;
    } else {
      throw new Error("Failed to get file data from Telegram");
    }
  } catch (error) {
    console.error("Error fetching voice file link:", error);
    throw error;
  }
}

async function getTranscription(voice, chatId) {
  try {
    const fileLink = await getVoiceFileLink(voice.file_id);
    const oggPath = `/tmp/voice_${voice.file_id}.ogg`;
    const wavPath = `/tmp/voice_${voice.file_id}.wav`;

    // Download the voice file
    const fileResponse = await axios.get(fileLink, {
      responseType: "arraybuffer",
    });
    await writeFile(oggPath, fileResponse.data);

    // Convert OGG to WAV
    await new Promise((resolve, reject) => {
      ffmpeg(oggPath)
        .toFormat("wav")
        .on("end", resolve)
        .on("error", reject)
        .save(wavPath);
    });

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(wavPath),
      model: "gpt-4o-mini-transcribe",
      language: "vi",
    });

    await sendTelegramMessage(
      TELEGRAM_BOT_TOKEN,
      chatId,
      `📝 Transcription:\n${transcription.text}\n`,
    );

    // Clean up files
    await Promise.all([unlink(oggPath), unlink(wavPath)]);

    return {
      error: false,
      transcription,
    };
  } catch (error) {
    console.error(`Error transcribing voice message: ${error}`);
    return {
      error: true,
      message: error.message,
    };
  }
}

async function getDataForTransaction() {
  try {
    const [{ data: categories }, { data: methods }, { data: funds }] =
      await Promise.all([
        axios.get(`${API_URL}/categories`, { headers }),
        axios.get(`${API_URL}/methods`, { headers }),
        axios.get(`${API_URL}/funds`, { headers }),
      ]);

    return {
      error: false,
      data: {
        categories: categories?.data?.map((category) => category.name) || [],
        funds: funds?.data?.map((fund) => fund.name) || [],
        methods: methods?.map((method) => method) || [],
      },
    };
  } catch (error) {
    return {
      error: true,
      message: error.message,
    };
  }
}

async function createTransaction(event) {
  try {
    const response = await axios.post(`${API_URL}/transactions`, event, {
      headers,
    });
    return {
      error: false,
      data: response.data,
    };
  } catch (error) {
    return {
      error: true,
      message: error.message,
    };
  }
}

async function handleVoice(voice, chatId) {
  try {
    const { error, message, transcription } = await getTranscription(
      voice,
      chatId,
    );
    if (error || !transcription || !transcription.text) {
      await sendTelegramMessage(
        TELEGRAM_BOT_TOKEN,
        chatId,
        `❌ Failed to transcribe the voice message.\n${message}`,
      );
      return;
    }

    const {
      error: dataError,
      data,
      message: dataMessage,
    } = await getDataForTransaction();
    if (dataError) {
      await sendTelegramMessage(
        TELEGRAM_BOT_TOKEN,
        chatId,
        `❌ Failed to fetch data for transaction.\n${dataMessage}`,
      );
    }

    const response = await openai.responses.create({
      // model: 'gpt-4o-2024-08-06',
      model: "gpt-4o-mini-2024-07-18",
      temperature: 0,
      input: [
        {
          role: "system",
          content: "Extract specific information from provided text.",
        },
        { role: "user", content: transcription.text },
      ],
      text: {
        ...getSchemaStructure(data),
      },
    });

    const event = JSON.parse(response.output_text);
    await sendTranscriptionWithButtons(chatId, event);
  } catch (error) {
    console.error(`Error handling voice message: ${error}`);
    await sendTelegramMessage(
      TELEGRAM_BOT_TOKEN,
      chatId,
      "❌ Failed to process your message. Please try again.",
    );
  }
}

async function handleText(text, chatId) {
  try {
    const {
      error: dataError,
      data,
      message: dataMessage,
    } = await getDataForTransaction();
    if (dataError) {
      await sendTelegramMessage(
        TELEGRAM_BOT_TOKEN,
        chatId,
        `❌ Failed to fetch data for transaction.\n${dataMessage}`,
      );
    }

    const response = await openai.responses.create({
      model: "gpt-4o-mini-2024-07-18",
      temperature: 0,
      input: [
        {
          role: "system",
          content: "Extract specific information from provided text.",
        },
        // { role: 'system', content: 'Extract the event information' },
        { role: "user", content: text },
      ],
      text: {
        ...getSchemaStructure(data),
      },
    });

    const event = JSON.parse(response.output_text);
    await sendTranscriptionWithButtons(chatId, event);
  } catch (error) {
    console.error("Error processing text message:", error);
    await sendTelegramMessage(
      TELEGRAM_BOT_TOKEN,
      chatId,
      "❌ Failed to process your message. Please try again.",
    );
  }
}

async function handleCallbackQuery(callbackData, chatId, messageId, text) {
  try {
    switch (callbackData) {
      case "accept_transaction": {
        // Create transaction
        const event = JSON.parse(text);
        const { data, error, message } = await createTransaction(event);

        if (error || !data) {
          return await editTelegramMessage(
            TELEGRAM_BOT_TOKEN,
            chatId,
            messageId,
            `❌ Failed to create transaction.\n${message}`,
          );
        }

        await editTelegramMessage(
          TELEGRAM_BOT_TOKEN,
          chatId,
          messageId,
          "✅ Transaction accepted and created!",
        );
        break;
      }

      case "reject_transaction":
        await editTelegramMessage(
          TELEGRAM_BOT_TOKEN,
          chatId,
          messageId,
          "❌ Transaction rejected.",
        );
        break;

      case "dont_ask_next_time":
        // TODO: Store user preference
        await editTelegramMessage(
          TELEGRAM_BOT_TOKEN,
          chatId,
          messageId,
          "🔕 Preference saved. Future transactions will be created automatically.",
        );
        break;
    }
  } catch (error) {
    console.error("Error handling callback query:", error);
    await editTelegramMessage(
      TELEGRAM_BOT_TOKEN,
      chatId,
      messageId,
      "❌ An error occurred while processing your request.",
    );
  }
}

module.exports = {
  sendTelegramMessage,
  getTranscription,
  getDataForTransaction,
  createTransaction,
  handleVoice,
  handleText,
  handleCallbackQuery,
};
