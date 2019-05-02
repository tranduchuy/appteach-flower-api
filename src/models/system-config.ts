import { pre, prop, Typegoose } from 'typegoose';

@pre<SystemConfig>('save', function (next) {
  this.updatedAt = new Date();
  next();
})
export class SystemConfig extends Typegoose {
  @prop({default: ''})
  logoImage: string;

  @prop({default: ''})
  topBarBannerImage: string;

  @prop({default: ''})
  homeBannerImage: string;

  @prop({default: []})
  propertyImages: [string];

  @prop()
  createdAt: Date;

  @prop()
  updatedAt: Date;
}

export default new SystemConfig().getModelForClass(SystemConfig);