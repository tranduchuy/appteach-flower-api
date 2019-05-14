import { pre, prop, Ref, Typegoose } from 'typegoose';
import { User } from './user';
import { Status } from '../constant/status';

@pre<Tags>('save', function (next) {
  this.updatedAt = new Date();
  next();
})
export class Tags extends Typegoose {
  @prop({required: true, index: true})
  slug: string;

  @prop({default: '', index: true})
  customSlug: string;

  @prop()
  keyword: string;

  @prop()
  refresh: number;

  @prop({default: Status.ACTIVE})
  status: number;

  @prop()
  toUser?: Ref<User>;

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

}

export default new Tags().getModelForClass(Tags);