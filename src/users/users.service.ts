/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from "bcrypt";
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UsersService {
    // injectModel specifies the collection in the mongo db
    // using models is better than array because its more scalable

    constructor(@InjectModel('users') private readonly users: Model<User>) { }

    async signup(email: string, password: string) {
        const existing_user = await this.users.findOne({ email });  
        if (existing_user) {
            throw new Error("Email is already in use");
        }

        const hashed_password = await bcrypt.hash(password,10)

        // new user cree
        const new_user = new this.users({
            email,
            password:hashed_password,
        });

        await new_user.save();
        return { message : "user created" , user: new_user };
    }

    async findUserByEmail(email: string) {
        return this.users.findOne({ email }).exec();
    }
}