import express, { Request, Response, NextFunction } from 'express';
import { databaseConnection } from './config/database';
import cors from 'cors';
import morgan from 'morgan';
import { json } from 'body-parser';
import Logger from '@utils/logger';

import authRoutes from '@routes/auth-routes';
import videoRoutes from '@routes/video-routes';
import commentRoutes from '@routes/comment-routes';
import replyRoutes from '@routes/reply-route';

const app = express();
const PORT = process.env.PORT || 3000;

const logger = new Logger();

// Connect to MongoDB
databaseConnection();

// Middleware
app.use(cors());
app.use(json());
app.use(express.json({limit: "500mb"}));
app.use(express.urlencoded({limit: "500mb", extended: true, parameterLimit:50000}));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/video', commentRoutes);
app.use('/api/video', replyRoutes);


// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('error', err);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
