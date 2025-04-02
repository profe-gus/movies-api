import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { auth, authorizeRoles } from "../middlewares/auth.middlewares";

export const userRouter = Router();


userRouter.get('/users', userController.findAllUsers);

userRouter.post('/user',auth,authorizeRoles(['SuperAdmin']), userController.createUser);

userRouter.post('/login', userController.login);
userRouter.put('/user:id',authorizeRoles(['SuperAdmin']), userController.updateUser);
userRouter.delete('/users/:id',authorizeRoles(['SuperAdmin']), userController.deleteUser);

