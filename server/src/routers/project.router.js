import express from 'express';
import * as projectController from '../controllers/project.controller.js';
import { jwtProtection } from '../middlewares/jwtProtection.middleware.js';

const router = express.Router();

router.get('/user/:username', projectController.getAllUserProjects);
router.get('/:id', projectController.get);
router.get('/highlightUpload/:uploadId', jwtProtection, projectController.highlightUpload);
router.get('/like/:id', jwtProtection, projectController.like);
router.get('/unlike/:id', jwtProtection, projectController.unlike);
router.get('/likeCount/:id', projectController.getLikeCount);
router.get('/isLiked/:id', jwtProtection, projectController.getIsLiked);
router.post('/', jwtProtection, projectController.create);
router.put('/:id', jwtProtection, projectController.update);
router.delete('/:id', jwtProtection, projectController.remove);


export { router };