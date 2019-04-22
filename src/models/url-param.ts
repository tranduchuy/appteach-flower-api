import { prop, Typegoose } from 'typegoose';

export class UrlParam extends Typegoose {
  @prop({default: null})
  topic?: number | null;

  @prop({default: null})
  specialOccasion?: number | null;

  @prop({default: null})
  design?: number | null;

  @prop({default: null})
  floret?: number | null;

  @prop({default: null})
  city?: string | null;

  @prop({default: null})
  district?: number | null;

  @prop({default: null})
  color?: number | null;

  @prop({default: null})
  priceRange?: number | null;

  @prop({default: new Date()})
  updatedAt: Date;

  @prop({default: new Date()})
  createdAt: Date;

  @prop({required: true})
  url: string;

  @prop({default: ''})
  customUrl?: string | null;
}

export default new UrlParam().getModelForClass(UrlParam);