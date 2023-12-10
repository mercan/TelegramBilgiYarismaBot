import { Message } from "node-telegram-bot-api";
import TelegramService from "../services/TelegramService";
import StatisticService from "../services/StatisticService";

export default async (msg: Message): Promise<void> => {
  const chatId = msg.chat.id;
  const users = await StatisticService.getUsersWith30OrMoreAnswerCount();

  for (const user of users) {
    const message = `
Merhaba!

Şu ana kadar ${StatisticService.getUserTotalQuestionCount(
      user.userId as number
    )} soru çözdün. 🤓
Bizce bu bizi puanlaman için yeterli. 🤩
Bizi puanlamak için <b>👇👇👇</b> butonuna tıkla. 🙏
Teşekkürler. 🤗

<b>Bol şans ve iyi eğlenceler! 🎉🎉🎉</b>
`;

    await TelegramService.sendMessage(chatId, message, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "👉 Puanla 👈",
              url: "https://t.me/dailychannelsbot?start=bilgiyarismabot",
            },
          ],
        ],
      },
    });
  }
};
