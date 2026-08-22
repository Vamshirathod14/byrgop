import 'dotenv/config';
import { connectDB } from '../src/config/db.js';
import BusinessType from '../src/models/BusinessType.js';
import Domain from '../src/models/Domain.js';

// Idempotent seeding for the BusinessType → Domain hierarchy.
//  - Upserts the three main business types (Admin-managed afterwards).
//  - Assigns every existing active domain that has no type yet to a sensible
//    default (data-level assignment, fully editable via Admin).
//  - Creates one NGO test domain so the NGO flow can be tested end-to-end.
//    Its 9 [TEST] domain questions are created by scripts/seedKYRedesign.js.

const TYPES = [
  { key: 'service', name: 'Service Based', description: 'Consulting, agencies, professional & financial services.', sortOrder: 1 },
  { key: 'product', name: 'Product Based', description: 'Manufacturing, retail, distribution and product brands.', sortOrder: 2 },
  { key: 'ngo', name: 'NGO / Non-Profit', description: 'Non-profit organisations, foundations and social impact.', sortOrder: 3 },
];

// Data-level defaults for existing demo domains (editable in Admin → Domains).
const DOMAIN_TYPE_DEFAULTS = {
  manufacturing: 'product',
  retail_ecommerce: 'product',
  professional_services: 'service',
  financial_services: 'service',
  technology_saas: 'service',
  healthcare_wellness: 'service',
  'fitness-gym-wellness-operations': 'service',
  hospitality_food_beverage: 'service',
  real_estate_construction: 'service',
  supply_chain_logistics: 'product',
  franchise_multi_unit: 'product',
};

const NGO_TEST_DOMAIN = {
  name: 'Education & Social Impact',
  slug: 'education-social-impact',
  description: '[TEST] NGOs, foundations and mission-driven education programmes.',
};

async function seed() {
  await connectDB();

  // 1. Business types
  for (const t of TYPES) {
    await BusinessType.updateOne(
      { key: t.key },
      { $setOnInsert: t },
      { upsert: true }
    );
  }
  const bts = await BusinessType.find().sort({ sortOrder: 1 }).lean();
  const byKey = new Map(bts.map((b) => [b.key, b]));
  console.log('[bt-seed] business types:', bts.map((b) => `${b.key}(${b._id})`).join(', '));

  // 2. Assign existing unassigned active domains by slug map
  let assigned = 0;
  for (const [slug, btKey] of Object.entries(DOMAIN_TYPE_DEFAULTS)) {
    const bt = byKey.get(btKey);
    if (!bt) continue;
    const res = await Domain.updateOne(
      { slug, $or: [{ businessTypeId: null }, { businessTypeId: { $exists: false } }] },
      { $set: { businessTypeId: bt._id } }
    );
    assigned += res.modifiedCount;
  }
  console.log(`[bt-seed] assigned ${assigned} existing domain(s) to a business type`);

  // 3. NGO test domain (only if absent)
  const ngo = byKey.get('ngo');
  const existingNgoDomains = await Domain.countDocuments({ businessTypeId: ngo._id });
  if (existingNgoDomains === 0) {
    await Domain.updateOne(
      { slug: NGO_TEST_DOMAIN.slug },
      {
        $setOnInsert: {
          ...NGO_TEST_DOMAIN,
          businessTypeId: ngo._id,
          active: true,
        },
      },
      { upsert: true }
    );
    console.log(`[bt-seed] created NGO test domain "${NGO_TEST_DOMAIN.name}"`);
  } else {
    console.log(`[bt-seed] ngo already has ${existingNgoDomains} domain(s), skipping test domain`);
  }

  // Summary
  const all = await Domain.find({ active: true }).sort({ name: 1 }).lean();
  for (const d of all) {
    const key = [...byKey.values()].find((b) => String(b._id) === String(d.businessTypeId))?.key || 'UNASSIGNED';
    console.log(`[bt-seed]   ${d.slug.padEnd(34)} → ${key}`);
  }
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('[bt-seed] failed', e);
    process.exit(1);
  });
