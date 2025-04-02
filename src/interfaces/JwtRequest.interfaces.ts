import { Request } from 'express';
import { UserRole } from '../models/user.model';

export interface  JwtRequest extends Request{
    user?:{
        email:string;
        role:UserRole;
    }
}