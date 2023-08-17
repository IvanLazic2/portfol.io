import express from 'express';
import * as thumbnailController from '../controllers/thumbnail.controller.js';

const router = express.Router();

router.get('/:projectId', thumbnailController.getAll);

export { router }