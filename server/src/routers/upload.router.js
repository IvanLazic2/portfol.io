import express from 'express';
import * as uploadController from '../controllers/upload.controller.js';
import { upload } from '../configs/upload.config.js';
import { jwtProtection } from '../middlewares/jwtProtection.middleware.js';
//import { multipleUploadMiddleware } from '../middlewares/multipleUpload.middleware.js';

const router = express.Router();

router.get('/:id', uploadController.get);
//router.post('/', multipleUploadMiddleware, uploadController.saveFiles);
router.post('/', jwtProtection, upload.single('upload'), uploadController.create);
router.delete('/:id', jwtProtection, uploadController.remove);

export { router }