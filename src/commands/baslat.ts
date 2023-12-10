import TelegramBot from "node-telegram-bot-api";
import QuestionService from "../services/QuestionService";
import RedisService from "../services/RedisService";
import TelegramService from "../services/TelegramService";

export default async (msg: TelegramBot.Message): Promise<void> => {
  const chatId: number = msg.chat.id;
  const difficulty: number = 1;
  const question = await QuestionService.getQuestionByDifficulty(difficulty);

  if (question) {
    const questionText = `${difficulty}/12 Soru\n\n${question.question}`;
    const open_period = 20;
    let correct_option_id: number = 0;

    switch (question.correctAnswer) {
      case "A":
        correct_option_id = 0;
        break;
      case "B":
        correct_option_id = 1;
        break;
      case "C":
        correct_option_id = 2;
        break;
      case "D":
        correct_option_id = 3;
        break;
    }

    const pollChoices = [
      question.answers["A"],
      question.answers["B"],
      question.answers["C"],
      question.answers["D"],
    ];

    const options: TelegramBot.SendPollOptions = {
      type: "quiz",
      is_anonymous: false,
      correct_option_id: correct_option_id,
      open_period: open_period,
      explanation: "Yanlış mı bildin, hadi yeniden deneyelim!",
    };

    const poll = await TelegramService.sendPoll(
      chatId,
      questionText,
      pollChoices,
      options
    );

    if (!poll || !poll.poll) {
      return console.log("Poll could not be sent.", poll);
    }

    RedisService.setQuiz(
      {
        chatId: chatId,
        quizId: poll.poll.id,
        questionId: question._id,
        correct_option_id: correct_option_id,
      },
      open_period
    );

    return;
  }

  TelegramService.sendMessage(
    chatId,
    "Bir hata oluştu. Lütfen daha sonra tekrar deneyin."
  );

  TelegramService.sendMessage(
    851852076, // Bot Developer Telegram ID
    `Soru gönderilemedi. Chat ID: ${chatId}, Chat Username: ${msg.chat.username}, Chat Type: ${msg.chat.type}`
  );
};
