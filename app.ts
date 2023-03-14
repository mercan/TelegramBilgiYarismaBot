import TelegramService from "./src/services/TelegramService";

// Database
import Database from "./src/helpers/database";

// Database connection
Database();

// Redis
import RedisService from "./src/services/RedisService";

// Redis connection
RedisService.connect();

// Commands
import startCommand from "./src/commands/start";
import baslatCommand from "./src/commands/baslat";
import istatistikCommand from "./src/commands/istatistik";

// Register commands
TelegramService.onText(/^\/start/, startCommand);
TelegramService.onText(/^\/baslat/, baslatCommand);
TelegramService.onText(/^\/istatistik/, istatistikCommand);

// Callback queries
TelegramService.callbackQuery((callback) => {
  if (callback.data === "/baslat") {
    baslatCommand(callback.message as any);
  }

  if (callback.data === "/istatistik") {
    istatistikCommand(callback.message as any);
  }

  return;
});

// Callback queries
import baslatCallbackQuery from "./src/callbackQuery/baslat";

// Register callback queries
TelegramService.pollCallback(baslatCallbackQuery);

// Redis expired key event handler
const onExpired = async (channel: string, message: string) => {
  const [prefix, quizId] = channel.split(":");
  const shadowPrefix = "shadow_quiz";

  if (prefix === shadowPrefix) return;

  const quiz = await RedisService.getShadowQuiz(quizId);

  if (!quiz) {
    return;
  }

  const msg = "Sorunuzun süresi doldu! 🕐";
  TelegramService.sendMessage(quiz.chatId, msg, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Yeniden Deneyelim!",
            callback_data: "/baslat",
          },
        ],
      ],
    },
  });

  RedisService.deleteShadowQuiz(quizId);
};

// Redis expired key event
RedisService.onQuizExpired(onExpired);
