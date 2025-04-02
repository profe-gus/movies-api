import {UserDocument,UserInput,UserModel} from "../models/user.model";
import { securityService } from "./security.service";

class UserService{


    async createUser(userInput: UserInput){
        try {
            const newUser = await UserModel.create(userInput);
            return newUser;
        } catch (error) {
            throw Error("Error creating user");
        }
    }

    async deleteUser(id: string){
        try {
            const deletedUser = await UserModel.findOneAndDelete({id:id});
            return deletedUser;
        } catch (error) {
            throw  Error("Error deleting user");
        }
    }


    async findById(id: string){
        try {
            const user: UserDocument | null = await UserModel.findOne({ id: id });
            if (!user) {
                console.log(`User with id: ${id} not found`);
            }
            return user;
        } catch (error) {
            throw Error("Error fetching user");
        }
    }
    async getAllUsers(): Promise<UserDocument[]>{
        try {
            const users :UserDocument[]= await UserModel.find();
            return users;
        } catch (error) {
            throw  Error("Error fetching users");
        }
    }

    async login(email: string, password: string){
        try {
            const user: UserDocument | null = await UserModel.findOne({ email: email });
            if (!user ||!(await securityService.comparePassword(password, user.password))) {
                throw new Error("Invalid email or password");
            }
            return user;
        } catch (error) {
            throw new Error("Error logging in");
        }
    }
    async updateUser(id: string, userInput: UserInput){
        try {
            const existingUser = await this.findById(id);
            if (!existingUser) {
                throw new Error("User not found");
            }
            userInput.password = existingUser.password;
            
            const updatedUser = await UserModel.findOneAndUpdate({ id: id }, userInput, { new: true });
            return updatedUser;
        } catch (error) {
            throw new Error("Error updating user");
        }
    }
}
export const userService = new UserService();