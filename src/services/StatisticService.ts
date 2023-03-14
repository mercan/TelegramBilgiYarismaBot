import TelegramBot from "node-telegram-bot-api";
import Statistic, { IStatistic } from "../models/StatisticModel";

class StatisticService {
  public getStatisticByUserId(userId: TelegramBot.ChatId) {
    return Statistic.findOne({ userId });
  }

  public async createStatistic(userData: IStatistic) {
    return Statistic.create(userData);
  }

  public async updateStatistic(userId: TelegramBot.ChatId, updateData: any) {
    return Statistic.updateOne({ userId }, updateData);
  }
}

export default new StatisticService();
