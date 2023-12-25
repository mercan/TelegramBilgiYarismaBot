import { Schema } from "mongoose";
import TelegramBot from "node-telegram-bot-api";

// Services
import { IStatistic } from "../models/StatisticModel";
import QuestionService from "../services/QuestionService";
import RedisService from "../services/RedisService";
import StatisticService from "../services/StatisticService";
import TelegramService from "../services/TelegramService";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async (pollCallback: TelegramBot.PollAnswer) => {
  const quiz = await RedisService.getQuiz(pollCallback.poll_id);
  RedisService.deleteQuiz(pollCallback.poll_id);
  RedisService.deleteShadowQuiz(pollCallback.poll_id);

  if (!quiz) {
    return;
  }

  const chatId = pollCallback.user.id;
  const questionId = quiz.questionId;
  const correct_option_id = quiz.correct_option_id;
  const sendMessageOptions: TelegramBot.SendMessageOptions = {
    parse_mode: "HTML",
  };

  const isCorrectAnswer = pollCallback.option_ids[0] == correct_option_id;
  const question = await QuestionService.getQuestionById(questionId);

  if (!question) {
    return;
  }

  const difficulty = question.difficulty;
  // Update statistic.
  const statistic = await StatisticService.getStatisticByUserId(chatId);

  if (!statistic) {
    const userData: IStatistic = {
      userId: chatId,
      name: pollCallback.user.first_name,

      totalQuestions: 1,
      totalCorrectAnswers: isCorrectAnswer ? 1 : 0,
      totalWrongAnswers: isCorrectAnswer ? 0 : 1,

      questions: [
        {
          questionId: question._id as unknown as Schema.Types.ObjectId,
          difficulty: difficulty,
          isCorrectAnswer: isCorrectAnswer,
        },
      ],
    };

    StatisticService.createStatistic(userData);
  } else {
    const updateData = {
      $inc: {
        totalQuestions: 1,
        totalCorrectAnswers: isCorrectAnswer ? 1 : 0,
        totalWrongAnswers: isCorrectAnswer ? 0 : 1,
      },

      $push: {
        questions: {
          questionId: question._id as unknown as Schema.Types.ObjectId,
          difficulty: difficulty,
          isCorrectAnswer: isCorrectAnswer,
        },
      },
    };

    StatisticService.updateStatistic(chatId, updateData);
  }

  if (!isCorrectAnswer) {
    await delay(500);
    const message = `Üzgünüm! Yanlış cevap verdiniz.\nDoğru Cevap: ${
      question.answers[question.correctAnswer]
    }`;

    return TelegramService.sendMessage(chatId, message, {
      ...sendMessageOptions,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Yeniden Deneyelim!",
              callback_data: "/baslat",
            },
          ],
          [
            {
              text: "İstatistiklerimi Göster",
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
  }

  if (difficulty == 12) {
    const message = `Tebrikler! Tüm soruları doğru bildiniz. 🎉\n\nYeniden başlamak için /baslat yazabilirsiniz.`;
    return TelegramService.sendMessage(chatId, message, sendMessageOptions);
  }

  const reactionMessages = [
    "Tebrikler!",
    "Harika!",
    "Harikasın!",
    "Mükemmel!",
    "Çok iyi!",
    "Çok iyisin!",
    "Güzel!",
    "Çok güzel!",
    "Tutturdun!",
    "Etkileyici!",
    "Etkileyicisin!",
    "Böyle devam!",
    "Böyle devam et!",
  ];

  let message: string =
    reactionMessages[Math.floor(Math.random() * reactionMessages.length)] + " ";

  if (difficulty == 2) {
    message +=
      "2. soru barajını geçtiniz. Geriye 10 soru kaldı. 🎉\n\nYeni soru yükleniyor...";
  } else if (difficulty == 7) {
    message +=
      "7. soru barajını geçtiniz. Geriye 5 soru kaldı. 🎉\n\nYeni soru yükleniyor...";
  } else {
    message += "Doğru cevap verdiniz. 🎉\n\nYeni soru yükleniyor...";
  }

  TelegramService.sendMessage(chatId, message, sendMessageOptions);
  await delay(1500);

  const newDifficulty: number = difficulty + 1;
  const nextQuestion = await QuestionService.getQuestionByDifficulty(
    newDifficulty
  );

  if (!nextQuestion) {
    return;
  }

  const questionText = `${newDifficulty}/12 Soru\n\n${nextQuestion.question}`;
  let new_correct_option_id: number = 0;

  switch (question.correctAnswer) {
    case "A":
      new_correct_option_id = 0;
      break;
    case "B":
      new_correct_option_id = 1;
      break;
    case "C":
      new_correct_option_id = 2;
      break;
    case "D":
      new_correct_option_id = 3;
      break;
  }

  const pollChoices = [
    nextQuestion.answers["A"],
    nextQuestion.answers["B"],
    nextQuestion.answers["C"],
    nextQuestion.answers["D"],
  ];

  let open_period: number = 0;
  switch (newDifficulty) {
    case 4:
    case 5:
      open_period = 30;
      break;

    case 6:
    case 7:
      open_period = 40;
      break;

    case 8:
    case 9:
    case 10:
      open_period = 50;
      break;

    default:
      open_period = 60;
      break;
  }

  const options: TelegramBot.SendPollOptions = {
    type: "quiz",
    is_anonymous: false,
    correct_option_id: new_correct_option_id,
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
      questionId: nextQuestion._id,
      correct_option_id: new_correct_option_id,
    },
    open_period
  );
};
