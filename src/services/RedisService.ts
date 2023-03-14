import TelegramBot from "node-telegram-bot-api";
import { Schema } from "mongoose";
import * as redis from "redis";
import config from "../config";

interface IQuiz {
  quizId: string;
  chatId: TelegramBot.ChatId;
  questionId: Schema.Types.ObjectId;
  correct_option_id: number;
}

class RedisService {
  private client: redis.RedisClientType;
  private clientSubscriber: redis.RedisClientType;

  constructor(connectOptions: redis.RedisClientOptions) {
    this.client = redis.createClient(connectOptions) as redis.RedisClientType;
    this.clientSubscriber = this.client.duplicate();

    // Redis connection events
    this.client.on("connect", async () => {
      console.log("Redis Connected!", { service: "Redis" });
    });

    // Redis error events
    this.client.on("error", (error) => {
      throw new Error(`Redis Connection Error: ${error}`);
    });

    // Redis Subscriber connection events
    this.clientSubscriber.on("connect", async () => {
      console.log("Redis Subscriber Connected!", { service: "Redis" });

      this.configureKeyspaceNotifications();
    });

    // Redis Subscriber error events
    this.clientSubscriber.on("error", (error) => {
      throw new Error(`Redis Subscriber Connection Error: ${error}`);
    });
  }

  connect() {
    this.client.connect();
    this.clientSubscriber.connect();
  }

  public setQuiz(quiz: IQuiz, expireTime: number): void {
    this.client.set(`quiz:${quiz.quizId}`, JSON.stringify(quiz), {
      EX: expireTime,
    });

    // Shadow new quiz in Redis
    this.client.set(`shadow_quiz:${quiz.quizId}`, JSON.stringify(quiz), {
      EX: expireTime + 10,
    });
  }

  public async getQuiz(quizId: string): Promise<IQuiz | null> {
    const quiz = await this.client.get(`quiz:${quizId}`);

    if (!quiz) {
      return null;
    }

    return JSON.parse(quiz);
  }

  public async getShadowQuiz(quizId: string): Promise<IQuiz | null> {
    const quiz = await this.client.get(`shadow_quiz:${quizId}`);

    if (!quiz) {
      return null;
    }

    return JSON.parse(quiz);
  }

  public deleteShadowQuiz(quizId: string): void {
    this.client.del(`shadow_quiz:${quizId}`);
  }

  public deleteQuiz(quizId: string): void {
    this.client.del(`quiz:${quizId}`);
  }

  // Configure Redis to notify when a key expires - clientSubscriber
  private async configureKeyspaceNotifications(): Promise<void> {
    const notifyKeySpaceEvents = await this.client.configGet(
      "notify-keyspace-events"
    );

    if (notifyKeySpaceEvents[1] !== "Ex") {
      await this.client.configSet("notify-keyspace-events", "Ex");
    }
  }

  public onQuizExpired(callback: (channel: string, key: string) => void): void {
    this.clientSubscriber.subscribe("__keyevent@0__:expired", callback);
  }
}

const connectOptions: redis.RedisClientOptions = {
  password: config.REDIS.PASSWORD,
  socket: {
    host: config.REDIS.HOST,
    port: config.REDIS.PORT,
  },
};

export default new RedisService(connectOptions);
