import { prop, Typegoose } from 'typegoose';
import { General } from '../constant/generals';
import { Status } from '../constant/status';
import UserRoles = General.UserRoles;
import RegisterByTypes = General.RegisterByTypes;

export class User extends Typegoose {
  _id: string;

  @prop({required: true})
  name: string;

  @prop({lowercase: true, trim: true})
  username: string;

  @prop({validate: /\S+@\S+\.\S+/, unique: true, lowercase: true, trim: true})
  email: string;

  @prop({unique: true, lowercase: true, trim: true, match: /[0-9]*/, minlength: 10, maxlength: 11})
  phone: string;

  @prop()
  passwordHash?: string;

  @prop()
  passwordSalt?: string;

  @prop()
  gender: number;

  @prop()
  city?: string;

  @prop()
  district?: number;

  @prop()
  ward?: number;

  @prop()
  address: string;

  @prop()
  type: number;

  @prop({required: true, default: Status.PENDING_OR_WAIT_CONFIRM})
  status: number;

  @prop({required: true, default: UserRoles.USER_ROLE_ENDUSER})
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

  @prop({default: RegisterByTypes.NORMAL})
  registerBy?: number;

  @prop()
  googleId?: string;

  @prop()
  facebookId?: string;

  @prop()
  otpCodeConfirmAccount: string;

  @prop({default: 0})
  noSentOTP: number;
}

export default new User().getModelForClass(User);
