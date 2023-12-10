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

  public async getUsersWith30OrMoreAnswerCount() {
    return Statistic.find({ totalQuestions: { $gte: 30 } });
  }

  public async getUserTotalQuestionCount(userId: number) {
    const statistic = await this.getStatisticByUserId(userId);
    return statistic?.totalQuestions || 0;
  }
}

export default new StatisticService();
