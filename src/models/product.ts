import { pre, prop, Ref, Typegoose } from 'typegoose';
import { Status } from '../constant/status';
import { Shop } from './shop';

@pre<Product>('save', function (next) {
  this.updatedAt = new Date();
  next();
})
export class Product extends Typegoose {
  @prop({required: true})
  title: string;

  @prop({required: true})
  images: string[];

  @prop({required: true})
  sku: string;

  @prop({required: true})
  description: string;

  @prop({required: true})
  topic: number;

  @prop()
  specialOccasion?: number;

  @prop({default: null})
  design?: number;

  @prop({default: null})
  floret?: number;

  @prop({default: null})
  city?: string;

  @prop({default: null})
  district?: number;

  @prop({default: null})
  color?: number;

  @prop({required: true})
  priceRange: number;

  @prop({required: true, index: true})
  slug: string;

  @prop({default: null})
  seoUrl?: string;

  @prop({default: null})
  seoDescription?: string;

  @prop({default: null})
  seoImage?: string;

  @prop({required: true, default: 0})
  originalPrice: number;

  @prop({required: true})
  saleOff: {
    price: number;
    startDate: Date;
    endDate: Date;
    active: boolean;
  };

  @prop({})
  code: string;

  @prop({default: new Date()})
  updatedAt: Date;

  @prop({default: new Date()})
  createdAt: Date;

  @prop({required: true})
  shop: Ref<Shop>;

  @prop({default: Status.ACTIVE})
  status: number;

  @prop({default: 0})
  view: number;

  @prop({default: []})
  tags: Array<string>;
  @prop({default: 0})
  sold: number;
}

export default new Product().getModelForClass(Product);