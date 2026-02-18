import 'reflect-metadata';
import express, { Application } from 'express';
import type { Request, Response } from 'express';
import config from 'config';
import cors from 'cors';

//routes
import authRouter from './api/routes/authRouter';

import connectDB from './utils/connectDB';
import { connectRedis } from './utils/connectRedis';

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

    app.use(cors(corsOptions));
    app.use(express.json());

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
