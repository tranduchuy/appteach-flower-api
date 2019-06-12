import { injectable } from 'inversify';
import { FRONT_END_DOMAIN } from '../utils/secrets';

const NodeMailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

@injectable()
export class MailerService {

  transporter = NodeMailer
    .createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: 'cskh.hecta@gmail.com',
        clientId: '392023644781-6u308jk38e2n7kl203uaf2gpqvn2foso.apps.googleusercontent.com',
        clientSecret: 'G7PGcCfpq8L4iUZgiHWLiojM',
        refreshToken: '1/TokkXRnESwFnkst42sfu1DVDsdL42vbhqrkfZiEzDA8',
        accessToken: 'ya29.Glu0BtTVpZ5SCPnzHHoUDz1NbKkiYadNUH5JFaI_6xguaMI7quCoJPFs1BmzIA3wMblycjDyv7cK-veDLIgzlEYrod05a8B4PUxq2HftC0JZxsD3DaTIilLxBJ4T',
        expires: 3600
      }
    });

  sendConfirmEmail = (email, name, token) => {
    try {
      this.transporter.use('compile', hbs({
        viewEngine: {
          extName: '.hbs',
          layoutsDir: './src/services/mailer-templates/templates/',
          defaultLayout: 'confirm',
          partialsDir: './src/services/mailer-templates/partials/'
        },
        viewPath: './src/services/mailer-templates/templates/',
        extName: '.hbs'
      }));

      const mailOptions = {
        from: 'cskh.hecta@gmail.com',
        to: email,
        subject: 'FLOWER VIỆT NAM - Xác Nhận Tài Khoản',
        template: 'confirm',
        context: {
          name: name,
          link: `${FRONT_END_DOMAIN}/xac-nhan-tai-khoan/${token}`
        }
      };

      this.transporter.sendMail(mailOptions, function (error) {
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
    try {
      this.transporter.use('compile', hbs({
        viewEngine: {
          extName: '.hbs',
          layoutsDir: './src/services/mailer-templates/templates/',
          defaultLayout: 'reset-password',
          partialsDir: './src/services/mailer-templates/partials/'
        },
        viewPath: './src/services/mailer-templates/templates/',
        extName: '.hbs'
      }));

      const mailOptions = {
        from: 'cskh.hecta@gmail.com',
        to: email,
        subject: 'FLOWER VIỆT NAM - Thông báo đổi mật khẩu',
        template: 'reset-password',
        context: {
          name: name,
          link: `${FRONT_END_DOMAIN}/dat-lai-mat-khau/${token}`
        }
      };

      this.transporter.sendMail(mailOptions, function (error) {
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
    try {
      const mailOptions = {
        from: 'cskh.hecta@gmail.com',
        to: email,
        subject: 'FLOWER VIỆT NAM - Thông tin thanh toán',
        text: `Đơn hàng #${orderId} đã thanh toán thành công`
      };

      this.transporter.sendMail(mailOptions, function (error) {
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
