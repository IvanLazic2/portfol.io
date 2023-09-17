import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { jwtProtection } from '../middlewares/jwtProtection.middleware.js';

const router = express.Router();

router.get('/id/:id', userController.getById);
router.get('/:username', userController.get);
router.put('/', jwtProtection, userController.update);
router.put('/changeUsername/', jwtProtection, userController.changeUsername);
router.put('/changeEmail/', jwtProtection, userController.changeEmail);
router.delete('/', jwtProtection, userController.remove);

export { router };