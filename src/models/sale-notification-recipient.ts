import { pre, prop, Typegoose, GetModelForClassOptions } from 'typegoose';

@pre<SaleNotificationRecipient>('save', function (next) {
    this.updatedAt = new Date();
    next();
})
export class SaleNotificationRecipient extends Typegoose {

    @prop({ required: true })
    email: string;

    @prop({ default: new Date() })
    createdAt: Date;

    @prop({ default: new Date() })
    updatedAt: Date;
}

const options: GetModelForClassOptions = {
    schemaOptions: {
        collection: 'saleNotificationRecipients'
    }
};

export default new SaleNotificationRecipient().getModelForClass(SaleNotificationRecipient, options);