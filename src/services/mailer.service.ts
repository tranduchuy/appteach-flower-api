import { injectable } from 'inversify';

const NodeMailer = require('nodemailer');


@injectable()
export class MailerService {
  transporter = NodeMailer.createTransport({
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
    },
  });

  sendConfirmEmail = (email, token) => {
    const mailOptions = {
      from: 'cskh.hecta@gmail.com',
      to: email,
      subject: 'Flower VN - Xác nhận đăng kí',
      text: 'http://157.230.248.161:4000/xac-nhan-tai-khoan/' + token
    };

    this.transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('MailService::sendConfirmEmail::error', error);
      } else {
        console.log(`MailService::sendConfirmEmail::success. Send mail to ${email} successfully`);
      }
    });
  };

  sendResetPassword = (email, token) => {
    return new Promise(((resolve, reject) => {
      const mailOptions = {
        from: 'cskh.hecta@gmail.com',
        to: email,
        subject: 'Flower VN - Đổi mật khẩu',
        text: 'http://localhost:4200/reset-password/' + token
      };

      this.transporter.sendMail(mailOptions, (err) => {
        if (err) {
          return reject(err);
        } else {
          return resolve();
        }
      });
    }));
  };


}
