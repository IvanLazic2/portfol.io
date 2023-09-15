import express from 'express';
import * as homeController from '../controllers/home.controller.js';
import * as homeService from '../services/home.service.js';

const router = express.Router();

router.get('/', homeController.getAll);

export { router };