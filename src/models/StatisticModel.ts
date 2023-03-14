import { Schema, model } from "mongoose";
import TelegramBot from "node-telegram-bot-api";

export interface IStatistic {
  userId: TelegramBot.ChatId;
  name: string;

  totalQuestions: number;
  totalCorrectAnswers: number;
  totalWrongAnswers: number;

  questions: Array<{
    questionId: Schema.Types.ObjectId;
    difficulty: number;
    isCorrectAnswer: boolean;
    createdAt?: Date;
  }>;

  createdAt?: Date;
}

const StatisticSchema = new Schema<IStatistic>(
  {
    userId: {
      type: Number,
      unique: true,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },

    totalCorrectAnswers: {
      type: Number,
      default: 0,
    },

    totalWrongAnswers: {
      type: Number,
      default: 0,
    },

    questions: [
      {
        _id: false,

        questionId: {
          type: Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },

        difficulty: {
          type: Number,
          required: true,
        },

        isCorrectAnswer: {
          type: Boolean,
          required: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for faster queries
StatisticSchema.index({ userId: 1 });

export default model<IStatistic>("Statistic", StatisticSchema);
