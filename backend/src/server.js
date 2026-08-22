import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';
import { notFound, errorHandler } from './middleware/errors.js';
import { connectDB } from './config/db.js';
import { bootstrapSuperAdminIfConfigured } from './services/bootstrapService.js';

const app = express();

app.use(
  cors({
    origin: (origin, cb) => {
      const allowed = (process.env.CLIENT_ORIGINS || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (!origin || allowed.includes(origin)) return cb(null, true);
      const err = new Error('Origin not allowed by CORS');
      err.status = 403;
      cb(err);
    },
  })
);
app.use(express.json());

app.use('/api/v1', apiRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await bootstrapSuperAdminIfConfigured();
  app.listen(PORT, () => console.log(`[api] listening on http://localhost:${PORT}`));
});
