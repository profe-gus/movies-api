
import { Request, Response, RequestHandler, NextFunction } from "express";
import { securityService, userService } from "../services";
import { UserDocument, UserInput } from "../models/user.model";


class UserController {


    createUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
          req.body.password = await securityService.encryptPassword(req.body.password);
          const newUser: UserDocument = await userService.createUser(req.body);
          res.status(201).json(newUser);
        } catch (error: any) {
            res.status(400).json({ message: `The user ${req.body.name} could not be created`});
        }
    };

    deleteUser: RequestHandler = async (req: Request, res: Response) =>{
        try {
            const deletedUser = await userService.deleteUser(req.params.id);
            if (!deletedUser) {
                res.status(404).json(`User ${req.params.id} whit name ${req.params.name} not found`);
                return;
            }
            res.status(204).json();
        } catch (error) {
            console.error(error);
            res.status(500).json(`Error deleting user ${req.params.name}`);
        }
    };

    login: RequestHandler=async (req, res) => {
        try {
            const user: UserDocument | null = await userService.login(req.body.email, req.body.password);
            if (!user) {
                res.status(401).json("Invalid email or password");
                return;
            }
            const token = await securityService.generateToken(user.id, user.email, user.role);
            res.json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).json("Error logging in");
        }
    }

    findUserById: RequestHandler = async (req: Request, res: Response) => {
        try {
            const user = await userService.findById(req.params.id);
            if (!user) {
                res.status(404).json(`User ${req.params.id} not found`);
                return;
            }
            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json(`Error fetching user ${req.params.id}`);
        }
    };

    findAllUsers: RequestHandler = async (req: Request, res: Response)=>{
        try {
            const users = await userService.getAllUsers();
            await res.json(users);
        } catch (error) {
            await res.status(500).json("Error fetching users");
        }
    };

    updateUser:RequestHandler = async(req:Request, res:Response)=> {
        try {
            const userExists: UserDocument | null = await userService.findById(req.params.id);
            if (!userExists) {
                res.status(404).json(`User ${req.params.id} not found`);
                return;
            }
            const updatedUser = await userService.updateUser(req.params.id, req.body);
            res.json(updatedUser);
        } catch (error) {
            console.error(error);
            res.status(500).json(`Error updating user ${req.params.id}`);
        }
    }
   
}

export const userController = new UserController();