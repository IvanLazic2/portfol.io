import express from 'express';
import * as projectController from '../controllers/project.controller.js';
import * as projectService from '../services/project.service.js';

const router = express.Router();

router.get('/', projectController.getAll);
router.get('/:id', projectController.get);
router.post('/', projectController.create);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.remove);

export { router };