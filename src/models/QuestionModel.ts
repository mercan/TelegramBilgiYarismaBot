import { Schema, model } from "mongoose";

interface IQuestion {
  question: string;
  difficulty: number;
  answers: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: "A" | "B" | "C" | "D";
}

const questionSchema = new Schema<IQuestion>(
  {
    question: {
      type: String,
      unique: true,
      required: true,
    },

    difficulty: {
      type: Number,
      required: true,
    },

    answers: {
      A: {
        type: String,
        required: true,
      },

      B: {
        type: String,
        required: true,
      },

      C: {
        type: String,
        required: true,
      },

      D: {
        type: String,
        required: true,
      },
    },

    correctAnswer: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
//questionSchema.index({ difficulty: 1 });

// Export the model and return your IQuestion interface
export default model<IQuestion>("Question", questionSchema);
