import TelegramBot from "node-telegram-bot-api";
import Config from "../config";

class TelegramService {
  private bot: TelegramBot;

  constructor(token: string) {
    this.bot = new TelegramBot(token, { polling: true });

    this.bot.on("polling_error", (error: Error) => {
      throw error;
    });

    this.bot.setMyCommands([
      {
        command: "start",
        description: "Botu Başlatmaya Yarar.",
      },
      {
        command: "baslat",
        description: "Oyunu Başlatmaya Yarar.",
      },
      {
        command: "istatistik",
        description: "Oyun İstatistiklerini Gösterir.",
      },
    ]);
  }

  public onText(
    pattern: RegExp,
    callback: (msg: TelegramBot.Message, match: RegExpExecArray | null) => void
  ): void {
    this.bot.onText(pattern, callback);
  }

  public sendMessage(
    chatId: TelegramBot.ChatId,
    message: string,
    options?: TelegramBot.SendMessageOptions
  ): Promise<TelegramBot.Message> {
    return this.bot.sendMessage(chatId, message, options);
  }

  public deleteMessage(chatId: number, messageId: string): void {
    this.bot.deleteMessage(chatId, messageId);
  }

  public sendPoll(
    chatId: number,
    question: string,
    pollChoices: string[],
    options?: TelegramBot.SendPollOptions
  ): Promise<TelegramBot.Message> {
    return this.bot.sendPoll(chatId, question, pollChoices, options);
  }

  public pollCallback(callback: (poll: TelegramBot.PollAnswer) => void): void {
    this.bot.addListener("poll_answer", callback);
  }

  public callbackQuery(
    callback: (query: TelegramBot.CallbackQuery) => void
  ): void {
    this.bot.on("callback_query", callback);
  }
}

export default new TelegramService(Config.TELEGRAM.TOKEN);
