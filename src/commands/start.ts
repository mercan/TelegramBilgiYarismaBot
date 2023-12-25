import TelegramBot from "node-telegram-bot-api";
import TelegramService from "../services/TelegramService";

export default (msg: TelegramBot.Message): void => {
  const chatId = msg.chat.id;
  const message = `
Merhaba <b>${msg.from?.first_name}</b>! Bilgi Yarışmasına Hoşgeldin! 🎉 🎉 🎉

Bilgi Yarışması toplamda 12 sorudan oluşuyor. Her soru için bir cevap vermeniz gerekiyor. Doğru cevap verirseniz bir sonraki soruya geçebilirsiniz. Ancak yanlış cevap verirseniz, oyununuz baştan başlayacaktır. Tüm 12 soruyu doğru yanıtlarsanız, oyunu tamamlamış olursunuz.

Soruların süreli olduğunu da hatırlatalım. Cevap vermek için belirli bir süreniz olacak ve süre içinde cevap vermezseniz maalesef kaybedeceksiniz.

Bilgi Yarışmasını başlatmak için /baslat komutunu kullanabilirsin.
İstatistiklerini görmek için /istatistik komutunu kullanabilirsin.

<b>Bol şans ve iyi eğlenceler! 🎉🎉🎉</b>
`;

  TelegramService.sendMessage(chatId, message, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🎉 Bilgi Yarışmasını Başlat 🎉",
            callback_data: "/baslat",
          },
        ],
        [
          {
            text: "📊 İstatistiklerimi Göster 📊",
            callback_data: "/istatistik",
          },
        ],
        [
          {
            text: "Botu Puanla",
            url: "https://t.me/dailychannelsbot?start=bilgiyarismabot",
          },
        ],
        [
          {
            text: "📢 Kanala Katıl 📢",
            url: "https://t.me/+FFSdrLh-kMAwZThk",
          },
        ],
      ],
    },
  });
};
