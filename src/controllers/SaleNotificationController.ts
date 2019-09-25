import { controller, httpPost } from 'inversify-express-utils';
import { Request } from 'express';
import { IRes } from '../interfaces/i-res';
import * as HttpStatus from 'http-status-codes';
import Joi from '@hapi/joi';
import RegisterSaleNotificationSchema from '../validation-schemas/sale-notification/register-sale-notification.schema';
import { inject } from 'inversify';
import TYPES from '../constant/types';
import { SaleNotificationService } from '../services/sale-notification.service';

@controller('/sale-notification')
export class SaleNotificationController {
    constructor(
        @inject(TYPES.SaleNotificationService) private _saleNotificationService: SaleNotificationService
    ) { }

    @httpPost('/register')
    public register(request: Request): Promise<IRes<any>> {
        return new Promise<IRes<any>>(async (resolve) => {
            try {
                const { error } = Joi.validate(request.body, RegisterSaleNotificationSchema);

                if (error) {
                    const messages = error.details.map(detail => {
                        return detail.message;
                    });

                    const result: IRes<any> = {
                        status: HttpStatus.BAD_REQUEST,
                        messages: messages
                    };

                    return resolve(result);
                }

                const { email } = request.body;

                let recipient = await this._saleNotificationService.findSaleNotificationRecipient(email);

                const result: IRes<any> = {
                    status: HttpStatus.OK,
                    messages: ['Đăng ký nhận thông báo khuyến mãi thành công'],
                    data: []
                };

                if (recipient) {
                    return resolve(result);
                }

                recipient = await this._saleNotificationService.createSaleNotificationRecipient(email);

                return resolve(result);

            } catch (e) {
                console.error(e);
                const result: IRes<{}> = {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    messages: [JSON.stringify(e)]
                };
                return resolve(result);
            }
        });
    }
}