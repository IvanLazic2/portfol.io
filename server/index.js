// https://github.com/geshan/expressjs-structure/tree/master

import express from "express";

import { router as projectRouter } from './src/routers/project.router.js';
import { router as uploadRouter } from './src/routers/upload.router.js';
import { router as thumbnailRouter } from './src/routers/thumbnail.router.js';
import { router as userRouter } from './src/routers/user.router.js';
import { router as profilePictureRouter } from './src/routers/profilePicture.router.js';
import { router as homeRouter } from './src/routers/home.router.js';
import { router as authRouter } from './src/routers/auth.router.js';

const port = 3000;

(
    async () => {

        const app = express();

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // routers
        app.use('/api/project', projectRouter);
        app.use('/api/upload', uploadRouter);
        app.use('/api/thumbnail', thumbnailRouter);
        app.use('/api/user', userRouter);
        app.use('/api/profilePicture', profilePictureRouter);
        app.use('/api/home', homeRouter);
        app.use('/api/auth', authRouter);

        app.listen(port, () => {
            console.log(`Server is listening at ${port}`);
        });

    }
)();