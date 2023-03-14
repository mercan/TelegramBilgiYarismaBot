import { Schema, isValidObjectId } from "mongoose";
import Question from "../models/QuestionModel";

interface IGetQuestionByDifficultyResponse {
  _id: Schema.Types.ObjectId;
  question: string;
  difficulty: number;
  answers: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
}

class QuestionService {
  public async getQuestionByDifficulty(
    difficulty: number
  ): Promise<IGetQuestionByDifficultyResponse> {
    if (difficulty < 1 || difficulty > 12) {
      return {} as IGetQuestionByDifficultyResponse;
    }

    const question = await Question.aggregate([
      {
        $match: {
          difficulty,
        },
      },
      {
        $sample: {
          size: 1,
        },
      },
    ]);

    return question[0];
  }

  public getQuestionById(questionId: Schema.Types.ObjectId) {
    if (!isValidObjectId(questionId)) {
      return;
    }

    return Question.findById(questionId);
  }
}

export default new QuestionService();
