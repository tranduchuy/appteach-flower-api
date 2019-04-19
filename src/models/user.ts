#!/bin/sh
import { prop, Typegoose } from "typegoose";
import { General } from "../constant/generals";
import { Status } from "../constant/status";
import UserRoles = General.UserRoles;
import Genders = General.Genders;
import UserTypes = General.UserTypes;

export class User extends Typegoose {
    @prop({required: true})
    name: string;
    @prop({ unique: true, required: true, lowercase: true, trim: true})
    username: string;
    @prop({ validate: /\S+@\S+\.\S+/, unique: true, required: true, lowercase: true, trim: true })
    email: string;
    @prop({ unique: true, required: true, lowercase: true, trim: true, match: /[0-9]*/, minlength: 10, maxlength: 11})
    phone: string;
    @prop({required: true})
    passwordHash: string;
    @prop({required: true, enum: Genders})
    gender: number;
    @prop({required: true})
    city: number;
    @prop({required: true})
    district: number;
    @prop({required: true})
    ward: number;
    @prop({required: true})
    address: string;
    @prop({required: true, enum: UserTypes})
    type: number;
    @prop({required: true, enum: Status, default: Status.PENDING_OR_WAIT_COMFIRM})
    status: number;
    @prop({required: true, enum: UserRoles, default: UserRoles.USER_ROLE_ENDUSER})
    role: number;
    @prop({default: Date.now()})
    createdAt?: Date;
    @prop({default: Date.now()})
    updatedAt?: Date;
    @prop()
    avatar?: string;
    @prop()
    birthday?: Date;
    @prop()
    tokenEmailConfirm?: string;
    @prop()
    passwordReminderToken?: string;
    @prop()
    passwordReminderExpire?: Date;
}

export default new User().getModelForClass(User);