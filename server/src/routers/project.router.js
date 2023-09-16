import express from 'express';
import * as projectController from '../controllers/project.controller.js';
import * as projectService from '../services/project.service.js';
import * as ratingController from '../controllers/rating.controller.js';
import { jwtProtection } from '../middlewares/jwtProtection.middleware.js';

const router = express.Router();

router.get('/user/:username', projectController.getAllUserProjects);
router.get('/:id', projectController.get);
//router.get('/highlightUpload/:uploadId', projectController.highlightUpload);
router.get('/like/:id', jwtProtection, projectController.like);
router.get('/unlike/:id', jwtProtection, projectController.unlike);
router.get('/likeCount/:id', projectController.getLikeCount);
router.get('/isLiked/:id', jwtProtection, projectController.getIsLiked);
router.post('/', jwtProtection, projectController.create);
//router.post('/rateProject/', ratingController.rateProject);
//router.post('/removeProjectRating/', ratingController.removeProjectRating);
router.put('/:id', jwtProtection, projectController.update);
router.delete('/:id', jwtProtection, projectController.remove);


export { router };