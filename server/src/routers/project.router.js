import express from 'express';
import * as projectController from '../controllers/project.controller.js';

const router = express.Router();

router.get('/:id', projectController.get);
router.post('/', projectController.create);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.remove);

export { router };