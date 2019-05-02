import { pre, prop, Ref, Typegoose } from 'typegoose';
import { Order } from './order';
import { Product } from './product';

@pre<Order>('save', function (next) {
  this.updatedAt = new Date();
  next();
})
export class OrderItem extends Typegoose {

  @prop()
  id: string;

  @prop({ ref: Order, required: true })
  order: Ref<Order>;

  @prop({ ref: Product, required: true })
  product: Ref<Product>;

  @prop({required: true, default: 1})
  quantity: number;

  @prop({ default: new Date() })
  updatedAt: Date;

  @prop({ default: new Date() })
  createdAt: Date;
}

export default new OrderItem().getModelForClass(OrderItem);