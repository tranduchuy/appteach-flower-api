import { pre, prop, Ref, Typegoose } from 'typegoose';
import { User } from './user';

@pre<Shop>('save', function (next) {
  this.updatedAt = new Date();
  next();
})
export class Shop extends Typegoose {
  @prop({required: true})
  name: string;

  @prop({required: true})
  url: string;

  @prop({required: true})
  user: Ref<User>;

  @prop()
  images: string[];

  @prop({required: true})
  status: number;

  @prop({default: false})
  availableShipCountry: boolean;

  @prop()
  updatedAt: Date;

  @prop()
  createdAt: Date;
}

export default new Shop().getModelForClass(Shop);