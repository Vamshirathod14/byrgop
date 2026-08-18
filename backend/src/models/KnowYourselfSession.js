import mongoose from 'mongoose';

const kySelectedQuestionSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'KnowYourselfQuestion', required: true },
    text: { type: String, required: true },
    source: { type: String, enum: ['generic', 'domain'], default: 'generic' },
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
    email: { type: String, default: null },
    domain: { type: String, default: null },
    selectedQuestions: { type: [kySelectedQuestionSchema], default: [] },
    answers: { type: [kyAnswerSchema], default: [] },
    result: { type: mongoose.Schema.Types.Mixed, default: null },
    lastActiveAt: { type: Date, default: Date.now },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
    phone: { type: String, default: null },
    contactConsent: { type: Boolean, default: false },
    contactSubmittedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

knowYourselfSessionSchema.index({ email: 1 });
knowYourselfSessionSchema.index({ domain: 1 });
knowYourselfSessionSchema.index({ status: 1 });
knowYourselfSessionSchema.index({ startedAt: -1 });

export default mongoose.model('KnowYourselfSession', knowYourselfSessionSchema);
