import express from 'express';
import * as uploadController from '../controllers/upload.controller.js';
import { uploadMiddleware } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.post('/', uploadMiddleware, uploadController.saveFiles);
router.delete('/:id', uploadController.deleteFile);

export { router }