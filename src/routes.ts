import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ListController from './app/controllers/ListController';

import { verifyJWT } from './app/middlewares/auth';

const router = Router();

router.post('/users', UserController.createUser);

router.post('/users/auth', SessionController.login);


// Protected Routes
router.use(verifyJWT);

router.get('/users/all', UserController.readAllUsers);
router.get('/users/:id', UserController.readUserById);
router.get('/users', UserController.readUsersByName);
router.put('/users/:id', UserController.update);
router.delete('/users/:id', UserController.delete);

router.post('/lists', ListController.createList);
router.get('/lists/all', ListController.readAllLists);
router.get('/lists/:id', ListController.readOneList);
router.get('/lists', ListController.readListsByName);
router.put('/lists/:id', ListController.updateList);
router.delete('/lists/:id', ListController.deleteList);


export default router;
