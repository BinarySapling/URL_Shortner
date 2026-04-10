import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { connectDB } from './config/db.js';
import urlRoutes from './routes/url.routes.js';
import { rateLimiter } from './middlewares/rateLimiter.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(rateLimiter);
app.use('/api', urlRoutes);
app.use(errorHandler);

await connectDB();
app.listen(process.env.PORT || 3000, () => console.log('Shortener service up'));