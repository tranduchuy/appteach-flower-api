import { pre, prop, Ref, Typegoose } from 'typegoose';
import { Order } from './order';
import { Product } from './product';
import { Shop } from './shop';
import { Status } from "../constant/status";

@pre<Order>('save', function (next) {
  this.updatedAt = new Date();
  next();
})
export class OrderItem extends Typegoose {

  @prop()
  id: string;

  @prop({ ref: Order, required: true })
  order: Ref<Order>;

  @prop({ ref: Shop, required: true })
  shop: Ref<Shop>;

  @prop({ ref: Product, required: true })
  product: Ref<Product>;

  @prop()
  title: string;

  @prop()
  images: string[];

  @prop()
  originalPrice: number;

  @prop()
  saleOff: {
    price: number;
    startDate: Date;
    endDate: Date;
    active: boolean;
  };

  @prop({ required: true, default: 1 })
  quantity: number;

  @prop({ required: true, default: 0 })
  price: number;

  @prop({ default: new Date() })
  updatedAt: Date;

  @prop({ default: new Date() })
  createdAt: Date;

  @prop({required: true, default: Status.ORDER_ITEM_PENDING})
  status: number;

  @prop()
  deliveredAt: Date;
}

export default new OrderItem().getModelForClass(OrderItem);