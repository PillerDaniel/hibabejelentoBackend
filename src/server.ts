import 'reflect-metadata';
import express, { Application } from 'express';
import type { Request, Response } from 'express';
import config from 'config';
import cors from 'cors';

//routes
import authRouter from './api/routes/authRouter';

//middlewares
import logger from './api/middlewares/logger';

import connectDB from './application/utils/connectDB';
import { connectRedis } from './application/utils/connectRedis';
import { startBot } from './application/utils/bot';

const PORT = config.get<number>('PORT');
const app: Application = express();

const corsOptions: cors.CorsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

const startServer = async () => {
    await connectDB();
    await connectRedis(process.env.REDIS_URL!);
    await startBot();

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(logger);

    //routes
    app.use('/api/auth', authRouter);

    app.get('/api', (req: Request, res: Response) => {
        res.send('API running');
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
