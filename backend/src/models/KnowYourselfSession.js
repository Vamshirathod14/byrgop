import mongoose from 'mongoose';

const kySelectedQuestionSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'KnowYourselfQuestion', required: true },
    text: { type: String, required: true },
    options: [
      {
        optionId: { type: mongoose.Schema.Types.ObjectId, required: true },
        text: { type: String, required: true },
        score: { type: Number, required: true },
      },
    ],
  },
  { _id: false }
);

const kyAnswerSchema = new mongoose.Schema(
  {
    questionIndex: { type: Number, required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    questionText: { type: String },
    optionId: { type: mongoose.Schema.Types.ObjectId },
    optionText: { type: String },
    score: { type: Number, default: 0 },
    answeredAt: { type: Date },
  },
  { _id: false }
);

const knowYourselfSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
    },
    selectedQuestions: { type: [kySelectedQuestionSchema], default: [] },
    answers: { type: [kyAnswerSchema], default: [] },
    result: { type: mongoose.Schema.Types.Mixed, default: null },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('KnowYourselfSession', knowYourselfSessionSchema);
