import { pre, prop, Ref, Typegoose } from 'typegoose';
import { User } from './user';

@pre<Address>('save', function (next) {
  this.updatedAt = new Date();
  next();
})
export class Address extends Typegoose {
  @prop({})
  name: string;

  @prop({})
  address: string;

  @prop({required: true})
  city: string;

  @prop({required: true})
  district: number;

  @prop({})
  type: number;

  @prop({})
  phone: string;

  @prop({default: new Date()})
  updatedAt: Date;

  @prop({default: new Date()})
  createdAt: Date;

  @prop({required: true})
  user: Ref<User>;
}

export default new Address().getModelForClass(Address);