import { pre, prop, Ref, Typegoose } from 'typegoose';
import { Status } from '../constant/status';
import { User } from './user';
import { Address } from './address';

@pre<Order>('save', function (next) {
  this.updatedAt = new Date();
  next();
})

class BuyerInfo extends Typegoose {
  @prop()
  name: string;
  @prop()
  email: string;
  @prop()
  phone: string;
}

export class Order extends Typegoose {
  _id: string;

  @prop({ref: User, required: true})
  fromUser: Ref<User>;

  @prop({ref: Address})
  address: Ref<Address>;

  @prop({required: true, default: Status.ORDER_PENDING})
  status: number;

  @prop({default: new Date()})
  updatedAt: Date;

  @prop({default: new Date()})
  createdAt: Date;

  @prop()
  paidAt: Date;

  @prop()
  submitAt: Date;

  @prop()
  deliveryTime: Date;

  @prop()
  expectedDeliveryTime: string;

  @prop()
  note: string;

  @prop()
  total: number;

  @prop()
  code: string;

  @prop({default: null})
  buyerInfo: BuyerInfo;
}

export default new Order().getModelForClass(Order);