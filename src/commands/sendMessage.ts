import { Message } from "node-telegram-bot-api";
import TelegramService from "../services/TelegramService";
import StatisticService from "../services/StatisticService";

export default async (msg: Message): Promise<void> => {
  const users = await StatisticService.getUsersWith30OrMoreAnswerCount();

  for await (const user of users) {
    try {
      const message = `
Merhaba!

Şu ana kadar ${await StatisticService.getUserTotalQuestionCount(
        user.userId as number
      )} soru çözdün.
Bizce bu bizi puanlaman için yeterli.

Bizi puanlamak için aşağıdaki butonuna tıkla. 🙏
Teşekkürler. 

<b>Bol şans ve iyi eğlenceler! 🎉</b>
`;

      await TelegramService.sendMessage(user.userId, message, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "👉 Puanla 👈",
                url: "https://t.me/dailychannelsbot?start=bilgiyarismabot",
              },
            ],
            [
              {
                text: "Oyuna Başla",
                callback_data: "/baslat",
              },
            ],
          ],
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
};
