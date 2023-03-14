import TelegramBot from "node-telegram-bot-api";
import Config from "../config";

class TelegramService {
  private bot: TelegramBot;

  constructor(token: string) {
    this.bot = new TelegramBot(token, { polling: true });

    this.bot.on("polling_error", (error) => {
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

  public getUpdates(): Promise<TelegramBot.Update[]> {
    return this.bot.getUpdates();
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

  public editMessageText(
    text: string,
    options: TelegramBot.EditMessageTextOptions
  ): void {
    this.bot.editMessageText(text, options);
  }

  public sendPoll(
    chatId: number,
    question: string,
    options: string[],
    optionsOptions?: TelegramBot.SendPollOptions
  ): Promise<TelegramBot.Message> {
    return this.bot.sendPoll(chatId, question, options, optionsOptions);
  }

  public stopPoll(
    chatId: number,
    messageId: number,
    options?: TelegramBot.StopPollOptions
  ): Promise<TelegramBot.Poll> {
    return this.bot.stopPoll(chatId, messageId, options);
  }

  public pollCallback(callback: (poll: TelegramBot.PollAnswer) => void): void {
    this.bot.addListener("poll_answer", callback);
  }

  public callbackQuery(
    callback: (query: TelegramBot.CallbackQuery) => void
  ): void {
    this.bot.on("callback_query", callback);
  }

  public answerCallbackQuery(
    callbackQueryId: string,
    options?: TelegramBot.AnswerCallbackQueryOptions
  ): void {
    this.bot.answerCallbackQuery(callbackQueryId, options);
  }

  public getChat(chatId: TelegramBot.ChatId): Promise<TelegramBot.Chat> {
    return this.bot.getChat(chatId);
  }
}

export default new TelegramService(Config.TELEGRAM.TOKEN);
