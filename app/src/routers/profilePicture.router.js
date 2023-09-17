import express from 'express';
import { upload } from '../configs/upload.config.js';
import { jwtProtection } from '../middlewares/jwtProtection.middleware.js';
import * as profilePictureController from '../controllers/profilePicture.controller.js';


const router = express.Router();

router.get('/:id', profilePictureController.get);
router.post('/', jwtProtection, upload.single('profilePicture'), profilePictureController.create);
router.delete('/', jwtProtection, profilePictureController.remove);

export { router };