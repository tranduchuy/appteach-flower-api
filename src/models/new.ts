import { pre, prop, Typegoose } from 'typegoose';
import { Status } from '../constant/status';
import { General } from '../constant/generals';

@pre<New>('save', function (next) {
  this.updatedAt = new Date();
  next();
})
export class New extends Typegoose {
  @prop({required: true})
  title: string;

  @prop({required: true})
  content: string;

  @prop()
  image: string;

  @prop()
  description: string;

  @prop({default: Status.ACTIVE})
  status: number;

  @prop({})
  type: number;

  @prop({})
  cate: number;

  @prop({default: []})
  admin: Array<string>;

  @prop({default: General.NewCreatedBy.HAND})
  createdByType: number;

  @prop({required: true})
  url: string;

  @prop({default: ''})
  customUrl?: string | null;

  @prop({default: Date.now})
  createdAt: Date;

  @prop({default: Date.now})
  updatedAt: Date;

  @prop()
  metaTitle: string;

  @prop()
  metaDescription: string;

  @prop()
  metaType: string;

  @prop()
  metaUrl: string;

  @prop()
  metaImage: string;

  @prop()
  canonical: string;

  @prop()
  textEndPage: string;

  @prop({default: []})
  tags: Array<string>;
}

export default new New().getModelForClass(New);