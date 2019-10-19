import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// public
routes.get('/users', UserController.index);
routes.post('/sessions', SessionController.store);

// private
routes.use(authMiddleware);
routes.put('/users', UserController.update);
routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);

export default routes;
