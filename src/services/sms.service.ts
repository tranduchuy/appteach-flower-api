import { injectable } from 'inversify';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from '../utils/secrets';

const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;
import Twilio from 'twilio';

@injectable()
export class SmsService {

  transporter = Twilio(accountSid, authToken);

  sendPaymentSuccesSMS = (phone, orderCode) => {
    try {
      const convertedPhone = '+84' + phone.slice(1);
      const smsOptions = {
            body: `Đơn hàng #${orderCode} đã thanh toán thành công`,
            from: '+16027867610',
            to: convertedPhone
          };

      this.transporter.messages.create(smsOptions, function (error) {
        if (error) {
          console.log('SmsService::sendPaymentSuccesSMS::error', error);
        } else {
          console.log(`SmsService::sendPaymentSuccesSMS::success. Send sms to ${phone} successfully`);
        }
      });
    } catch (e) {
      console.log('SmsService::sendPaymentSuccesSMS::error::catch', e);
    }
  };

}
