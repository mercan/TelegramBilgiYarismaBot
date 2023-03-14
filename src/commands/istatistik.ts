import TelegramBot from "node-telegram-bot-api";
import StatisticModel from "../models/StatisticModel";
import TelegramService from "../services/TelegramService";

export default async (msg: TelegramBot.Message): Promise<void> => {
  const chatId = msg.chat.id;

  const statistic = await StatisticModel.findOne({
    userId: chatId,
  });

  if (!statistic || statistic.totalQuestions < 20) {
    TelegramService.sendMessage(
      chatId,
      "İstatistiklerini görmek için en az 20 soru cevaplaman gerekiyor.",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Oynamaya Başla!",
                callback_data: "/baslat",
              },
            ],
          ],
        },
      }
    );

    return;
  }

  const totalCorrectAnswerPercentage = (
    (statistic.totalCorrectAnswers / statistic.totalQuestions) *
    100
  ).toFixed(2);
  const totalWrongAnswerPercentage = (
    (statistic.totalWrongAnswers / statistic.totalQuestions) *
    100
  ).toFixed(2);

  const message = `
📊 <b>İstatistikler</b> 📊

Toplam Soru: ${statistic.totalQuestions}
Toplam Doğru Cevap: ${statistic.totalCorrectAnswers}
Toplam Yanlış Cevap: ${statistic.totalWrongAnswers}

Doğru Cevap Yüzdesi: ${totalCorrectAnswerPercentage}%
Yanlış Cevap Yüzdesi: ${totalWrongAnswerPercentage}%
`;

  TelegramService.sendMessage(chatId, message, {
    parse_mode: "HTML",
  });
};
