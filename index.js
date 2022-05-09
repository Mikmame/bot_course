const TelegramApi = require("node-telegram-bot-api");
const { options } = require("nodemon/lib/config");

const token = "5380605458:AAHUAFsHLFU95oSULniwwX-IIjSLRzJVNrM";

const bot = new TelegramApi(token, { polling: true });
const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Now i guess a nuber from 0 to 9, and you have to guess it`
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "guess!", gameOptions);
};
const { gameOptions, againOptions } = require("./options");
const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Greeting" },
    { command: "/info", description: "Get info" },
    { command: "/game", description: "Guess" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://cdn.tlgrm.app/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/256/2.webp"
      );
      return bot.sendMessage(chatId, `Welcome to telegram BOT Mikmame`);
    }
    if (text === "/info")
      return bot.sendMessage(
        chatId,
        `Your name ${msg.from.first_name} ${msg.from.last_name}`
      );
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, "I am not understand you, try again");
  });
  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data === chats[chatId]) {
      return bot.sendMessage(chatId, `Great ${chats[chatId]}`, againOptions);
    } else {
      return bot.sendMessage(chatId, `You lose ${chats[chatId]}`, againOptions);
    }
  });
};

start();
