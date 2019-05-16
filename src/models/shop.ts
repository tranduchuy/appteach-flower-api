import { pre, prop, Ref, Typegoose } from 'typegoose';
import { Status } from '../constant/status';
import { User } from './user';

@pre<Shop>('save', function (next) {
  this.updatedAt = new Date();
  next();
})
export class Shop extends Typegoose {
  _id: string;

  @prop({required: true})
  name: string;

  @prop({required: true, unique: true})
  slug: string;

  @prop({required: true})
  user: Ref<User>;

  @prop()
  images: string[];

  @prop({required: true, default: Status.PENDING_OR_WAIT_CONFIRM})
  status: number;

  @prop({default: false})
  availableShipCountry: boolean;

  @prop()
  updatedAt: Date;

  @prop()
  createdAt: Date;

  @prop({default: 0, max: 100})
  discountRate: number;
}

export default new Shop().getModelForClass(Shop);