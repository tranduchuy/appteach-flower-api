import { pre, prop, Ref, Typegoose, arrayProp } from 'typegoose';
import { User } from './user';
import { Product } from './product';

@pre<Product>('save', function (next) {
  this.updatedAt = new Date();
  next();
})
export class Cart extends Typegoose {

  @prop()
  id: string;

  @prop({ required: true })
  user: Ref<User>;

  @arrayProp({ itemsRef: Product })
  products: Ref<Product>[];

  @prop({ default: new Date() })
  updatedAt: Date;

  @prop({ default: new Date() })
  createdAt: Date;
}

export default new Cart().getModelForClass(Cart);