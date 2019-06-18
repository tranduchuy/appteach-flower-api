import { injectable } from 'inversify';
import { SPEED_SMS_TOKEN, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from '../utils/secrets';
import https from 'https';

const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;
import Twilio from 'twilio';

@injectable()
export class SmsService {
  transporter = Twilio(accountSid, authToken);

  private convertPhoneNumber(phone: string): string {
    if (phone.indexOf('+84') === 0) {
      return phone.slice(1);
    }

    if (phone.indexOf('84') === 0) {
      return phone;
    }

    if (phone.indexOf('0') === 0) {
      return '84' + phone.slice(1);
    }

    return '84' + phone;
  }

  sendPaymentSuccessSMS = (phone, orderCode) => {
    try {
      const convertedPhone = this.convertPhoneNumber(phone);
      const content = `Đơn hàng #${orderCode} đã thanh toán thành công`;
      this.sendSMS([convertedPhone], content, 'Flower Vietnam');
    } catch (e) {
      console.log('SmsService::sendPaymentSuccessSMS::error::catch', e);
    }
  };

  sendSMS = (phones: string[], content: string, sender: string = 'Flower Vietnam') => {
    const url = 'api.speedsms.vn';
    const params = JSON.stringify({
      to: phones.map(phone => this.convertPhoneNumber(phone)),
      content: content,
      sms_type: 2,
      sender: sender
    });

    const buf = new Buffer(SPEED_SMS_TOKEN + ':x');
    const auth = 'Basic ' + buf.toString('base64');
    const options = {
      hostname: url,
      port: 443,
      path: '/index.php/sms/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth
      }
    };

    const req = https.request(options, function (res) {
      res.setEncoding('utf8');
      let body = '';
      res.on('data', function (d) {
        body += d;
      });
      res.on('end', function () {
        const json = JSON.parse(body);
        if (json.status == 'success') {
          console.log('send sms success');
        } else {
          console.log('send sms failed ' + body);
        }
      });
    });

    req.on('error', function (e) {
      console.log('send sms failed: ' + e);
    });

    req.write(params);
    req.end();
  };

}
