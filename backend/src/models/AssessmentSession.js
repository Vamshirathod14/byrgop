import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    categoryKey: { type: String, required: true },
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    questionText: { type: String },
    optionId: { type: mongoose.Schema.Types.ObjectId },
    optionText: { type: String },
    score: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    stageKey: { type: String, default: null, lowercase: true, trim: true },
    stage: {
      type: { key: String, name: String, color: String },
      default: null,
    },
    timedOut: { type: Boolean, default: false },
    startedAt: { type: Date, required: true },
    answeredAt: { type: Date },
  },
  { _id: true }
);

const sessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['in_progress', 'completed', 'abandoned'], default: 'in_progress' },
    answers: { type: [answerSchema], default: [] },
    result: { type: mongoose.Schema.Types.Mixed, default: null },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('AssessmentSession', sessionSchema);
