import { prop, Typegoose } from 'typegoose';
import { General } from '../constant/generals';
import { Status } from '../constant/status';
import UserRoles = General.UserRoles;
import Genders = General.Genders;
import UserTypes = General.UserTypes;
import RegisterByTypes = General.RegisterByTypes;

export class User extends Typegoose {
  @prop({required: true})
  name: string;

  @prop({unique: true, lowercase: true, trim: true})
  username: string;

  @prop({validate: /\S+@\S+\.\S+/, unique: true, required: true, lowercase: true, trim: true})
  email: string;

  @prop({unique: true, lowercase: true, trim: true, match: /[0-9]*/, minlength: 10, maxlength: 11})
  phone: string;

  @prop()
  passwordHash?: string;

  @prop()
  passwordSalt?: string;

  @prop({enum: Genders})
  gender: number;

  @prop()
  city?: string;

  @prop()
  district?: number;

  @prop()
  ward?: number;

  @prop()
  address: string;

  @prop({enum: UserTypes})
  type: number;

  @prop({required: true, enum: Status, default: Status.PENDING_OR_WAIT_COMFIRM})
  status: number;

  @prop({required: true, enum: UserRoles, default: UserRoles.USER_ROLE_ENDUSER})
  role: number;

  @prop({default: new Date()})
  createdAt?: Date;

  @prop({default: new Date()})
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

  @prop({enum: RegisterByTypes, default: RegisterByTypes.NORMAL})
  registerBy?: number;

  @prop()
  googleId?: string;

  @prop()
  facebookId?: string;
}

export default new User().getModelForClass(User);