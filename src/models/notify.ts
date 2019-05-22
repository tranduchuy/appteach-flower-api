import { pre, prop, Ref, Typegoose } from 'typegoose';
import { User } from './user';

@pre<Notify>('save', function (next) {
  this.updatedAt = new Date();
  next();
})
export class Notify extends Typegoose {
  @prop()
  title: string;

  @prop()
  content: string;

  @prop()
  status: number;

  @prop()
  type: number;

  @prop()
  params: Object;

  @prop()
  fromUser?: Ref<User>;

  @prop()
  toUser?: Ref<User>;

  @prop({default: new Date()})
  createdAt: Date;

  @prop({default: new Date()})
  updatedAt: Date;
}

export default new Notify().getModelForClass(Notify);