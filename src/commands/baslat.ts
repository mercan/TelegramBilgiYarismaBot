import TelegramBot from "node-telegram-bot-api";
import QuestionService from "../services/QuestionService";
import RedisService from "../services/RedisService";
import TelegramService from "../services/TelegramService";

/**
 * Sends a question with multiple-choice answers to a Telegram chat.
 * @param msg - The Telegram message object representing the chat.
 */
export default async (msg: TelegramBot.Message): Promise<void> => {
  const chatId: number = msg.chat.id;
  const difficulty: number = 1;

  const question = await QuestionService.getQuestionByDifficulty(difficulty);

  if (question) {
    const questionText = `${difficulty}/12 Soru\n\n${question.question}`;
    const open_period = 30;

    const correct_option_id =
      question.correctAnswer == "A"
        ? 0
        : question.correctAnswer == "B"
        ? 1
        : question.correctAnswer == "C"
        ? 2
        : 3;

    const pollChoices = [
      question.answers["A"],
      question.answers["B"],
      question.answers["C"],
      question.answers["D"],
    ];

    const pollOptions: TelegramBot.SendPollOptions = {
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
      pollOptions
    );

    if (!poll || !poll.poll) {
      console.log("Poll could not be sent.", poll);

      return;
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
  }
};
