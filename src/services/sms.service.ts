import { injectable } from 'inversify';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER } from '../utils/secrets';

const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;
const serviceNumber = TWILIO_NUMBER;
import Twilio from 'twilio';

@injectable()
export class SmsService {

  transporter = Twilio(accountSid, authToken);

  sendPaymentSuccesSMS = (phone, orderId) => {
    try {
      const smsOptions = {
            body: `Đơn hàng ${orderId} đã thanh toán thành công`,
            from: '+15017122661',
            to: serviceNumber
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
