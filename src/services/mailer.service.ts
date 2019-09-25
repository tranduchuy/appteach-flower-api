import { injectable } from 'inversify';
import { FRONT_END_DOMAIN, SENDGRID_API_KEY } from '../utils/secrets';

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

@injectable()
export class MailerService {

  sendConfirmEmail = (email, name, token) => {
    const msg = {
      from: 'cskh.flowervietnam@gmail.com',
      to: email,
      subject: 'FLOWER VIỆT NAM - Xác Nhận Tài Khoản',
      templateId: 'd-e15ac1367e204daa8cc38ae18a5a036f',
      dynamic_template_data: {
        name,
        link: `${FRONT_END_DOMAIN}/xac-nhan-tai-khoan/${token}`,
      },
    };

    try {
      sgMail.send(msg, (error: any) => {
        if (error) {
          console.log('MailService::sendConfirmEmail::error', error);
        } else {
          console.log(`MailService::sendConfirmEmail::success. Send mail to ${email} successfully`);
        }
      });
    } catch (e) {
      console.log('MailService::sendConfirmEmail::error::catch', e);
    }
  };

  sendResetPassword = (email, name, token) => {
    const msg = {
      from: 'cskh.flowervietnam@gmail.com',
      to: email,
      subject: 'FLOWER VIỆT NAM - Thông báo đổi mật khẩu',
      templateId: 'd-425d8139040a41e1aefebe88489c5664',
      dynamic_template_data: {
        name,
        link: `${FRONT_END_DOMAIN}/dat-lai-mat-khau/${token}`,
      },
    };

    try {
      sgMail.send(msg, (error: any) => {
        if (error) {
          console.log('MailService::sendResetPassword::error', error);
        } else {
          console.log(`MailService::sendResetPassword::success. Send mail to ${email} successfully`);
        }
      });
    } catch (e) {
      console.log('MailService::sendResetPassword::error::catch', e);
    }
  };

  sendPaymentSuccesEmail = (email, orderId) => {
    const msg = {
      from: 'cskh.flowervietnam@gmail.com',
      to: email,
      subject: 'FLOWER VIỆT NAM - Thông tin thanh toán',
      text: `Đơn hàng #${orderId} đã thanh toán thành công`
    };

    try {
      sgMail.send(msg, (error: any) => {
        if (error) {
          console.log('MailService::sendPaymentSuccesEmail::error', error);
        } else {
          console.log(`MailService::sendPaymentSuccesEmail::success. Send mail to ${email} successfully`);
        }
      });
    } catch (e) {
      console.log('MailService::sendPaymentSuccesEmail::error::catch', e);
    }
  };

  sendNotifyMessage = (email, title, content) => {
    const msg = {
      from: 'cskh.flowervietnam@gmail.com',
      to: email,
      subject: title,
      text: content
    };

    try {
      sgMail.send(msg, (error: any) => {
        if (error) {
          console.log('MailService::sendPaymentSuccesEmail::error', error);
        } else {
          console.log(`MailService::sendPaymentSuccesEmail::success. Send mail to ${email} successfully`);
        }
      });
    } catch (e) {
      console.log('MailService::sendPaymentSuccesEmail::error::catch', e);
    }
  };

}
