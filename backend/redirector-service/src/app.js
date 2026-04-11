import 'dotenv/config';
import express from 'express';
import mongoSanitize from 'mongo-sanitize';
import helmet from 'helmet';
import compression from 'compression';
import { connectDB } from './config/db.js';
import redirectRoutes from './routes/redirect.route.js';
import { errorHandler } from './middlewares/errorHandler.js';
import env from './config/env.js';
import { startClickSync } from './workers/clickSync.js';

const app = express();
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize(req.body);
  next();
});
app.use(helmet());
app.use(compression());
app.use('/', redirectRoutes);
app.use(errorHandler);

await connectDB();
startClickSync(60000); // Sync every minute
app.listen(env.PORT, () => console.log(`Redirector service up on port ${env.PORT}`));
