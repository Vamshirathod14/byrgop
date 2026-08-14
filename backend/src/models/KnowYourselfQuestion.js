import mongoose from 'mongoose';

const kyOptionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    score: { type: Number, required: true, min: 1, max: 4 },
    active: { type: Boolean, default: true },
  },
  { _id: true }
);

const knowYourselfQuestionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    options: { type: [kyOptionSchema], default: [] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

knowYourselfQuestionSchema.pre('validate', function (next) {
  if (this.active) {
    const errors = [];
    const options = (this.options || []).filter((o) => o.active);
    if (options.length < 4) {
      errors.push('Active question must have exactly 4 active options');
    }
    const scores = options.map((o) => Number(o.score));
    for (const s of scores) {
      if (!Number.isInteger(s) || s < 1 || s > 4) {
        errors.push('Each option score must be an integer from 1 to 4');
      }
    }
    if (errors.length) {
      const err = new Error(errors.join('; '));
      err.status = 400;
      return next(err);
    }
  }
  next();
});

knowYourselfQuestionSchema.index({ active: 1 });

export default mongoose.model('KnowYourselfQuestion', knowYourselfQuestionSchema);
