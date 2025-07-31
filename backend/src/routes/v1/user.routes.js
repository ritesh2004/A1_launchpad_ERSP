import { Router } from 'express';
import { validateInput } from '../../middlewares/inputValidate.middlewares.js';
import { userCreateSchema, userLoginSchema } from '../../schema/user.schema.js';
import { createUser, getUserProfile, loginUser } from '../../controllers/user.controllers.js';
import { authorizeUser } from '../../middlewares/authorize.middlewares.js';

const router = Router();

router.post('/signup', validateInput(userCreateSchema), createUser);

router.post('/login', validateInput(userLoginSchema), loginUser);

router.get('/profile', authorizeUser, getUserProfile);

export default router;