import express from 'express';
import * as thumbnailController from '../controllers/thumbnail.controller.js';

const router = express.Router();

router.get('/:id', thumbnailController.get);
//router.get('/:id', thumbnailController.get);

export { router }