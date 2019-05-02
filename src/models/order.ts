import { pre, prop, Ref, Typegoose } from 'typegoose';
import { Status } from '../constant/status';
import { User } from './user';

@pre<Order>('save', function (next) {
  this.updatedAt = new Date();
  next();
})
export class Order extends Typegoose {

  @prop()
  id: string;

  @prop({ ref: User, required: true })
  user: Ref<User>;

  @prop({required: true, default: Status.ORDER_PENDING})
  status: number;

  @prop({ default: new Date() })
  updatedAt: Date;

  @prop({ default: new Date() })
  createdAt: Date;
}

export default new Order().getModelForClass(Order);