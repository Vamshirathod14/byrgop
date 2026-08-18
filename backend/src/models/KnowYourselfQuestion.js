import mongoose from 'mongoose';

const kyOptionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    score: { type: Number, required: true, min: 1, max: 4 },
    active: { type: Boolean, default: true },
  },
  { _id: true }
);

const DOMAIN_KEYS = [
  'manufacturing',
  'retail_ecommerce',
  'professional_services',
  'healthcare_wellness',
  'supply_chain_logistics',
  'technology_saas',
  'financial_services',
  'real_estate_construction',
  'hospitality_food_beverage',
  'franchise_multi_unit',
];

const DOMAIN_LABELS = {
  manufacturing: 'Manufacturing & Industrial Operations',
  retail_ecommerce: 'Retail & E-Commerce',
  professional_services: 'Professional Services & Consulting',
  healthcare_wellness: 'Healthcare & Wellness Operations',
  supply_chain_logistics: 'Supply Chain, Logistics & Distribution',
  technology_saas: 'Technology & SaaS / Digital Products',
  financial_services: 'Financial Services & FinTech',
  real_estate_construction: 'Real Estate, Construction & Infrastructure',
  hospitality_food_beverage: 'Hospitality, Food & Beverage (F&B)',
  franchise_multi_unit: 'Franchise & Multi-Unit Chains',
};

const knowYourselfQuestionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    type: { type: String, enum: ['generic', 'domain'], default: 'generic' },
    domain: { type: String, enum: [...DOMAIN_KEYS, null], default: null },
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
    if (this.type === 'domain' && !this.domain) {
      errors.push('Domain questions must specify a domain');
    }
    if (errors.length) {
      const err = new Error(errors.join('; '));
      err.status = 400;
      return next(err);
    }
  }
  next();
});

knowYourselfQuestionSchema.index({ active: 1, type: 1, domain: 1 });

export { DOMAIN_KEYS, DOMAIN_LABELS };
export default mongoose.model('KnowYourselfQuestion', knowYourselfQuestionSchema);
