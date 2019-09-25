import { injectable } from 'inversify';
import SaleNotificationRecipientModel from '../models/sale-notification-recipient';

@injectable()
export class SaleNotificationService {
    saleNotificationRecipientFields = ['_id', 'email'];

    findSaleNotificationRecipient = async (email: string) => await SaleNotificationRecipientModel.findOne({ email });

    createSaleNotificationRecipient = async (email: string) => {
        const newRecipient = new SaleNotificationRecipientModel({
            email
        });
        return await newRecipient.save();
    }
}