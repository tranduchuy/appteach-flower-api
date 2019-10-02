import {
  controller, httpGet, httpPost, httpPut
} from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../constant/types';
import { Request, Response } from 'express';
import { IRes } from '../interfaces/i-res';
import UserModel from '../models/user';
import UserModel2, { User2 } from '../models/user.model';
import { SmsService } from '../services/sms.service';
import { UserService } from '../services/user.service';
import { General } from '../constant/generals';
import UserRoles = General.UserRoles;
import { Status } from '../constant/status';
import UserTypes = General.UserTypes;
import { MailerService } from '../services/mailer.service';
import RegisterByTypes = General.RegisterByTypes;
import * as HttpStatus from 'http-status-codes';
import Joi from '@hapi/joi'; // validate schema
import UpdateUserValidationSchema from '../validation-schemas/user/update-user.schema';
import loginValidationSchema from '../validation-schemas/user/login.schema';
import loginGoogleSchema from '../validation-schemas/user/login-google.schema';
import registerSchema from '../validation-schemas/user/register.schema';
import { ResponseMessages } from '../constant/messages';
import forgetPasswordValidationSchema from '../validation-schemas/user/forget-password.schema';
import resetPasswordValidationSchema from '../validation-schemas/user/reset-password.schema';
import { ImageService } from '../services/image.service';
import LoginFacebookValidationSchema from '../validation-schemas/user/login-facebook.schema';
import { FacebookGraphApiService } from '../services/facebook-graph-api.service';
import ResendConfirmAccountSchema from '../validation-schemas/user/resend-confirm-email.schema';
import AccountConfirmationOTP from '../validation-schemas/user/account-confirmation-otp.schema';
import ResendOTPSchema from '../validation-schemas/user/resend-otp.schema';
import { UserConstant } from '../constant/users';
import RandomString from 'randomstring';
import ConfirmByPhoneValidationSchema from '../validation-schemas/user/confirm-by-phone.schema';
import RegisterShopValidationSchema from '../validation-schemas/user/register-shop.schema';
import { ShopService } from '../services/shop.service';
import { AddressService } from '../services/address.service';

interface IResResendConfirmEmail {
}

@controller('/user')
export class UserController {
  constructor(
    @inject(TYPES.ShopService) private shopService: ShopService,
    @inject(TYPES.UserService) private userService: UserService,
    @inject(TYPES.ImageService) private imageService: ImageService,
    @inject(TYPES.MailerService) private mailerService: MailerService,
    @inject(TYPES.FacebookGraphApiService) private facebookGraphApiService: FacebookGraphApiService,
    @inject(TYPES.SmsService) private smsService: SmsService,
    @inject(TYPES.AddressService) private addressService: AddressService
  ) {
  }

  @httpGet('/info', TYPES.CheckTokenMiddleware)
  public getLoggedInInfo(request: Request): Promise<IRes<User2>> {
    return new Promise<IRes<User2>>((resolve => {
      try {
        const user: User2 = JSON.parse(JSON.stringify(<User2>request.user));
        delete user.passwordHash;
        delete user.passwordSalt;
        delete user.passwordReminderExpire;
        delete user.passwordReminderToken;

        const result: IRes<User2> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: user
        };

        return resolve(result);

      } catch (e) {
        console.error(e);
        const result: IRes<User2> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: [JSON.stringify(e)]
        };
        return resolve(result);
      }
    }));
  }

  @httpPost('/register')
  public registerNewUser(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const { error } = Joi.validate(request.body, registerSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages,
            data: {}
          };
          return resolve(result);
        }
        const {
          email, password, confirmedPassword,
          name, username, phone, address, gender, city, district, ward
        } = request.body;

        const duplicatedPhones = await UserModel2.findAll({ where: { phone: phone } });
        if (duplicatedPhones.length !== 0) {
          const result: IRes<{}> = {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            messages: [ResponseMessages.User.Register.PHONE_DUPLICATED],
            data: {}
          };
          return resolve(result);
        }

        if (password !== confirmedPassword) {
          const result: IRes<{}> = {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            messages: [ResponseMessages.User.Register.PASSWORD_DONT_MATCH],
            data: {}
          };
          return resolve(result);
        }

        const duplicatedUsers = await UserModel2.findAll({ where: { email: email } });
        if (duplicatedUsers.length !== 0) {
          const result: IRes<{}> = {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            messages: [ResponseMessages.User.Register.EMAIL_DUPLICATED],
            data: {}
          };
          return resolve(result);
        }

        const otpCode = this.userService.generateOTPCode();

        const newUserData = {
          email,
          name,
          password,
          type: UserTypes.TYPE_CUSTOMER,
          role: null,
          phone: phone,
          gender,
          city: city || null,
          district: district || null,
          ward: ward || null,
          registerBy: RegisterByTypes.NORMAL,
          address,
          otpCode,
          googleId: null,
          facebookId: null
        };

        const newUser = await this.userService.createUser(newUserData);

        if (request.user && [UserRoles.USER_ROLE_MASTER, UserRoles.USER_ROLE_ADMIN].some(request.user.role)) {
          newUser.status = Status.ACTIVE;
          newUser.tokenEmailConfirm = '';
          await newUser.save();
        } else {
          // Send email
          // this.mailerService.sendConfirmEmail(email, name, newUser.tokenEmailConfirm);
          this.smsService.sendSMS([phone], `Mã xác thục tài khoản: ${otpCode}`, '');
        }

        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.User.Register.REGISTER_SUCCESS],
          data: {
            meta: {},
            entries: [{ email, name, username, phone, address, gender, city, district, ward }]
          }
        };

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


  @httpPost('/shop')
  public registerNewShop(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const { error } = Joi.validate(request.body, RegisterShopValidationSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages,
            data: {}
          };
          return resolve(result);
        }
        const {
          email, password, confirmedPassword,
          name, username, phone, address, gender, longitude, latitude,
          shopName, slug, images, availableShipCountry, availableShipAddresses
        } = request.body;

        const duplicatedPhones = await UserModel.find({ phone: phone });
        if (duplicatedPhones.length !== 0) {
          const result: IRes<{}> = {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            messages: [ResponseMessages.User.Register.PHONE_DUPLICATED],
            data: {}
          };
          return resolve(result);
        }

        const duplicateShopSlug: any = await this.shopService.findShopBySlug(slug);
        if (duplicateShopSlug) {
          const result: IRes<any> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.Shop.DUPLICATE_SLUG]
          };

          return resolve(result);
        }

        if (password !== confirmedPassword) {
          const result: IRes<{}> = {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            messages: [ResponseMessages.User.Register.PASSWORD_DONT_MATCH],
            data: {}
          };
          return resolve(result);
        }

        const duplicatedUsers = await UserModel.find({ email: email });
        if (duplicatedUsers.length !== 0) {
          const result: IRes<{}> = {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            messages: [ResponseMessages.User.Register.EMAIL_DUPLICATED],
            data: {}
          };
          return resolve(result);
        }

        const otpCode = this.userService.generateOTPCode();

        const newUserData = {
          email,
          name,
          password,
          type: UserTypes.TYPE_CUSTOMER,
          role: null,
          phone: phone,
          gender,
          city: null,
          district: null,
          ward: null,
          registerBy: RegisterByTypes.NORMAL,
          address: null,
          otpCode
        };

        const newUser = await this.userService.createUser(newUserData);

        const shop: any = await this.shopService.createNewShop(newUser.id.toString(), shopName, slug, images, availableShipCountry);

        await this.addressService.createShopAddress(shop._id.toString(), address, longitude, latitude);

        if (availableShipAddresses.length > 0) {
          // delete old possibaleDeliveryAddress
          await this.addressService.deleteOldPossibleDeliveryAddress(shop._id);
        }

        await Promise.all((availableShipAddresses || []).map(async (addressData: { city: string, district?: number }) => {
          await this.addressService.createPossibleDeliveryAddress({
            district: addressData.district,
            city: addressData.city,
            shopId: shop._id.toString()
          });
        }));

        // Send email
        // this.mailerService.sendConfirmEmail(email, name, newUser.tokenEmailConfirm);
        this.smsService.sendSMS([phone], `Mã xác thục tài khoản: ${otpCode}`, '');

        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.User.Register.REGISTER_SUCCESS],
          data: {
            meta: {},
            entries: [{ email, name, username, phone, address, gender, longitude, latitude }]
          }
        };

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

  @httpPut('/', TYPES.CheckTokenMiddleware)
  public updateUser(request: Request): Promise<IRes<any>> {
    return new Promise<IRes<any>>(async (resolve) => {
      try {
        const user = request.user;
        const { error } = Joi.validate(request.body, UpdateUserValidationSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages,
            data: {}
          };
          return resolve(result);
        }
        const {
          password, newPassword, confirmedPassword, name, phone, birthday, address, city, district, ward, gender, avatar
        } = request.body;

        if (phone) {
          if (phone !== user.phone) {
            const duplicatedPhones = await UserModel2.findAll({ where: { phone } });
            if (duplicatedPhones.length !== 0) {
              const result: IRes<{}> = {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                messages: [ResponseMessages.User.Register.PHONE_DUPLICATED],
                data: {}
              };
              return resolve(result);
            }
          }
        }

        if (password) {
          if (!newPassword || !confirmedPassword) {
            const result: IRes<{}> = {
              status: HttpStatus.BAD_REQUEST,
              messages: [ResponseMessages.User.Login.WRONG_PASSWORD],
              data: {}
            };
            return resolve(result);
          }
        }

        if (newPassword) {
          if (!password || !confirmedPassword) {
            const result: IRes<{}> = {
              status: HttpStatus.BAD_REQUEST,
              messages: [ResponseMessages.User.Login.WRONG_PASSWORD],
              data: {}
            };
            return resolve(result);
          }
        }

        if (confirmedPassword) {
          if (!newPassword || !confirmedPassword) {
            const result: IRes<{}> = {
              status: HttpStatus.BAD_REQUEST,
              messages: [ResponseMessages.User.Login.WRONG_PASSWORD],
              data: {}
            };
            return resolve(result);
          }
        }

        if (password && newPassword && confirmedPassword) {
          if (!this.userService.isValidHashPassword(user.passwordHash, password)) {
            const result: IRes<{}> = {
              status: HttpStatus.BAD_REQUEST,
              messages: [ResponseMessages.User.Login.WRONG_PASSWORD],
              data: {}
            };
            return resolve(result);
          }

          if (newPassword !== confirmedPassword) {
            const result: IRes<{}> = {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              messages: [ResponseMessages.User.Register.PASSWORD_DONT_MATCH],
              data: {}
            };
            return resolve(result);
          }
        }

        if (avatar) {
          if (avatar.link !== user.avatar) {
            const oldImages = [user.avatar] || [];
            const newImages = [avatar];
            if (newImages) {
              this.imageService.updateImages(oldImages, newImages);
            }
          }
        }

        const newUserData = {
          newPassword,
          name,
          phone,
          address,
          city,
          district,
          ward,
          birthday,
          gender,
          avatar
        };
        await this.userService.updateUser(user, newUserData);
        const userInfoResponse = {
          _id: user.id,
          role: user.role,
          email: user.email,
          username: user.username,
          name: name || user.name,
          phone: phone || user.phone,
          address: address || user.address,
          type: user.type,
          birthday: birthday || user.birthday,
          status: user.status,
          avatar: avatar ? avatar.link : user.avatar,
          gender: gender || user.gender,
          city: city || user.city,
          district: district || user.district,
          ward: ward || user.ward,
          registerBy: user.registerBy
        };

        const result: IRes<any> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {
            userInfoResponse
          }
        };

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

  @httpPost('/login')
  public login(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const { error } = Joi.validate(request.body, loginValidationSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages,
            data: {}
          };
          return resolve(result);
        }

        const { email, password } = request.body;
        const emailOrPhone = email;
        const user = await this.userService.findByEmailOrPhone(emailOrPhone, emailOrPhone);

        if (!user) {
          const result: IRes<{}> = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.User.USER_NOT_FOUND],
            data: {}
          };
          return resolve(result);
        }

        console.log(JSON.stringify(user));

        if (!this.userService.isValidHashPassword(user.passwordHash, password)) {
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.User.Login.WRONG_PASSWORD],
            data: {}
          };
          return resolve(result);
        }

        if (user.status !== Status.ACTIVE) {
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.User.Login.INACTIVE_USER],
            data: {}
          };
          return resolve(result);
        }

        const userInfoResponse = {
          _id: user.id,
          role: user.role,
          email: user.email,
          username: user.username,
          name: user.name,
          phone: user.phone,
          address: user.address,
          type: user.type,
          status: user.status,
          avatar: user.avatar,
          gender: user.gender,
          city: user.city,
          district: user.district,
          ward: user.ward,
          registerBy: user.registerBy
        }
          ;
        const token = this.userService.generateToken({ _id: user.id });

        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.User.Login.LOGIN_SUCCESS],
          data: {
            meta: {
              token
            },
            entries: [userInfoResponse]
          }
        };

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

  @httpPost('/login-by-google')
  public loginByGoogle(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const { error } = Joi.validate(request.body, loginGoogleSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages,
            data: {}
          };
          return resolve(result);
        }

        const { email, googleId, name } = request.body;

        let user = await this.userService.findByGoogleId(googleId);

        if (!user) {
          user = await this.userService.findByEmail(email);

          if (user) {
            user = await this.userService.updateGoogleId(user, googleId);
          } else {

            const newUser = {
              name,
              email,
              googleId,
            };
            user = await this.userService.createUserByGoogle(newUser);

            const result: IRes<{}> = {
              status: HttpStatus.CREATED,
              messages: [ResponseMessages.User.Login.NEW_USER_BY_GOOGLE],
              data: {
                meta: {},
                entries: []
              }
            };
            return resolve(result);
          }
        }

        if (user.status === Status.PENDING_OR_WAIT_CONFIRM) {
          const result: IRes<{}> = {
            status: HttpStatus.CREATED,
            messages: [ResponseMessages.User.Login.NEW_USER_BY_GOOGLE],
            data: {
              meta: {},
              entries: []
            }
          };
          return resolve(result);
        }

        const userInfoResponse = {
          id: user.id,
          role: user.role,
          email: user.email,
          username: user.username,
          name: user.name,
          phone: user.phone,
          address: user.address,
          type: user.type,
          status: user.status,
          avatar: user.avatar,
          gender: user.gender,
          city: user.city,
          district: user.district,
          ward: user.ward,
          registerBy: user.registerBy,
          googleId: user.googleId
        };
        const token = this.userService.generateToken({ _id: user.id });

        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.User.Login.LOGIN_SUCCESS],
          data: {
            meta: {
              token
            },
            entries: [userInfoResponse]
          }
        };

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

  @httpPost('/confirm-phone-google-account')
  public confirmPhone(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const { error } = Joi.validate(request.body, ConfirmByPhoneValidationSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages
          };
          return resolve(result);
        }

        const { phone, id } = request.body;
        let user: any = await this.userService.findByPhone(phone);


        if (user) {
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.User.Register.PHONE_DUPLICATED],
            data: {
              meta: {},
              entries: []
            }
          };
          return resolve(result);
        }
        user = await this.userService.findByGoogleId(id);
        if (!user) {
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.User.USER_NOT_FOUND],
            data: {
              meta: {},
              entries: []
            }
          };
          return resolve(result);
        }
        const otpCode: any = this.userService.generateOTPCode();
        user.phone = phone;
        user.otpCodeConfirmAccount = otpCode;
        this.smsService.sendSMS([user.phone], `FlowerVietnam: Mã xác thục tài khoản: ${otpCode}`, '');
        await user.save();

        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.User.Register.RESEND_OTP],
          data: {}
        };

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


  @httpPost('/confirm-phone-facebook-account')
  public confirmPhoneFacebookAccount(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const { error } = Joi.validate(request.body, ConfirmByPhoneValidationSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages,
            data: {}
          };
          return resolve(result);
        }

        const { phone, id } = request.body;
        let user: any = await this.userService.findByPhone(phone);


        if (user) {
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.User.Register.PHONE_DUPLICATED],
            data: {
              meta: {},
              entries: []
            }
          };
          return resolve(result);
        }
        user = await this.userService.findByFacebookId(id);
        if (!user) {
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.User.USER_NOT_FOUND],
            data: {
              meta: {},
              entries: []
            }
          };
          return resolve(result);
        }
        const otpCode: any = this.userService.generateOTPCode();
        user.phone = phone;
        user.otpCodeConfirmAccount = otpCode;
        this.smsService.sendSMS([user.phone], `FlowerVietnam: Mã xác thục tài khoản: ${otpCode}`, '');
        await user.save();

        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.User.Register.RESEND_OTP],
          data: {}
        };

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

  @httpPost('/login-by-facebook')
  public loginByFacebook(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const { error } = Joi.validate(request.body, LoginFacebookValidationSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages,
            data: {}
          };
          return resolve(result);
        }

        const { token } = request.body;

        const facebookInfo: any = await this.facebookGraphApiService.getUserInfoByAccessToken(token);
        if (facebookInfo === null) {
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.User.Login.INVALID_TOKEN],
            data: {}
          };
          return resolve(result);
        }

        const { id, name } = facebookInfo;

        let user = await this.userService.findByFacebookId(id);

        if (!user) {
          if (user) {
            user = await this.userService.updateFacebookId(user, id);
          } else {
            const newUser = {
              name,
              facebookId: id
            };
            user = await this.userService.createUserByFacebook(newUser);

            const result: IRes<{}> = {
              status: HttpStatus.CREATED,
              messages: [ResponseMessages.User.Login.NEW_USER_BY_FACEBOOK],
              data: {
                facebookId: id
              }
            };
            return resolve(result);
          }
        }

        if (user.status === Status.PENDING_OR_WAIT_CONFIRM) {
          const result: IRes<{}> = {
            status: HttpStatus.CREATED,
            messages: [ResponseMessages.User.Login.NEW_USER_BY_FACEBOOK],
            data: {
              facebookId: id
            }
          };
          return resolve(result);
        }

        const userInfoResponse = {
          _id: user.id,
          role: user.role,
          email: user.email,
          username: user.username,
          name: user.name,
          phone: user.phone,
          address: user.address,
          type: user.type,
          status: user.status,
          avatar: user.avatar,
          gender: user.gender,
          city: user.city,
          district: user.district,
          ward: user.ward,
          registerBy: user.registerBy,
          facebookId: user.facebookId
        };
        const resToken = this.userService.generateToken({ _id: user._id });

        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.User.Login.LOGIN_SUCCESS],
          data: {
            meta: {
              token: resToken
            },
            entries: [userInfoResponse]
          }
        };

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

  @httpGet('/account-confirm')
  public confirm(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const { token } = request.query;

        const user = await UserModel2.findOne({ where: { tokenEmailConfirm: token } });

        if (!user) {
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.User.Confirm.INVALID_TOKEN],
            data: {}
          };
          return resolve(result);
        }

        user.status = Status.ACTIVE;
        user.tokenEmailConfirm = '';

        await user.save();
        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.User.Confirm.CONFIRM_SUCCESS],
          data: {
            meta: {},
            entries: []
          }
        };

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


  @httpGet('/forget-password')
  public forgetPassword(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const { error } = Joi.validate(request.query, forgetPasswordValidationSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages,
            data: {}
          };
          return resolve(result);
        }

        const { email } = request.query;
        const user = await this.userService.findByEmail(email);
        if (!user) {
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.User.Login.USER_NOT_FOUND],
            data: {}
          };
          return resolve(result);
        }

        if (user.registerBy !== RegisterByTypes.NORMAL) {
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.User.ForgetPassword.INVALID_REGISTER_TYPE],
            data: {}
          };
          return resolve(result);
        }

        await this.userService.generateForgetPasswordToken(user);
        await this.mailerService.sendResetPassword(user.email, user.name, user.passwordReminderToken);

        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.User.ForgetPassword.FORGET_PASSWORD_SUCCESS],
          data: {
            meta: {},
            entries: []
          }
        };

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

  @httpPost('/reset-password')
  public resetPassword(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const { error } = Joi.validate(request.body, resetPasswordValidationSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages,
            data: {}
          };
          return resolve(result);
        }

        const { token, password, confirmedPassword } = request.body;
        if (password !== confirmedPassword) {
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.User.Register.PASSWORD_DONT_MATCH],
            data: {}
          };
          return resolve(result);
        }

        const user = await this.userService.findUserByPasswordReminderToken(token);

        if (!user) {
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.User.USER_NOT_FOUND],
            data: {}
          };
          return resolve(result);
        }

        if (this.userService.isExpiredTokenResetPassword(user.passwordReminderExpire)) {
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.User.ResetPassword.EXPIRED_TOKEN],
            data: {}
          };
          return resolve(result);
        }

        await this.userService.resetPassword(password, user);

        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.User.ResetPassword.RESET_PASSWORD_SUCCESS],
          data: {
            meta: {},
            entries: []
          }
        };

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

  @httpPost('/resend-confirm')
  public resendConfirmAccount(req: Request): Promise<IRes<IResResendConfirmEmail>> {
    return new Promise(async (resolve) => {
      const { error } = Joi.validate(req.body, ResendConfirmAccountSchema);
      if (error) {
        const messages = error.details.map(detail => {
          return detail.message;
        });

        const result: IRes<IResResendConfirmEmail> = {
          status: HttpStatus.BAD_REQUEST,
          messages: messages
        };
        return resolve(result);
      }

      const user: any = await this.userService.findByEmail(req.body.email);
      if (!user || user.status !== Status.PENDING_OR_WAIT_CONFIRM) {
        const result: IRes<IResResendConfirmEmail> = {
          status: HttpStatus.BAD_REQUEST,
          messages: [ResponseMessages.User.USER_NOT_FOUND]
        };
        return resolve(result);
      }

      const tokenEmailConfirm = RandomString.generate({
        length: UserConstant.tokenConfirmEmailLength,
        charset: 'alphabetic'
      });
      user.tokenEmailConfirm = tokenEmailConfirm;
      await user.save();
      this.mailerService.sendConfirmEmail(user.email, user.name, tokenEmailConfirm);


      const result: IRes<IResResendConfirmEmail> = {
        status: HttpStatus.OK,
        messages: [ResponseMessages.User.Confirm.CONFIRM_SUCCESS]
      };
      return resolve(result);
    });
  }

  @httpPost('/account-confirmation-by-code')
  public confirmAccountByOTPCode(req: Request): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async resolve => {
      try {
        const { error } = Joi.validate(req.body, AccountConfirmationOTP);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<IResResendConfirmEmail> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages
          };
          return resolve(result);
        }

        const { otp, phone } = req.body;
        const user: any = await this.userService.findByPhone(phone);

        if (!user) {
          return resolve({
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.User.USER_NOT_FOUND]
          });
        }

        if (user.otpCodeConfirmAccount !== otp.toString()) {
          return resolve({
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.User.Register.WRONG_OTP]
          });
        }

        user.status = Status.ACTIVE;
        await user.save();


        const userInfoResponse = {
          _id: user.id,
          role: user.role,
          email: user.email,
          username: user.username,
          name: user.name,
          phone: user.phone,
          address: user.address,
          type: user.type,
          status: user.status,
          avatar: user.avatar,
          gender: user.gender,
          city: user.city,
          district: user.district,
          ward: user.ward,
          registerBy: user.registerBy,
          facebookId: user.facebookId
        };
        const resToken = this.userService.generateToken({ _id: user._id });

        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.User.Confirm.CONFIRM_SUCCESS],
          data: {
            meta: {
              token: resToken
            },
            entries: [userInfoResponse]
          }
        };
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

  @httpPost('/resend-otp')
  public resendOTP(req: Request): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async resolve => {
      try {
        const { error } = Joi.validate(req.body, ResendOTPSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<IResResendConfirmEmail> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages
          };
          return resolve(result);
        }

        const user: any = await this.userService.findByPhone(req.body.phone);
        if (!user || user.status !== Status.PENDING_OR_WAIT_CONFIRM) {
          const result: IRes<IResResendConfirmEmail> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.User.USER_NOT_FOUND]
          };

          return resolve(result);
        }
        user.noSentOTP = user.noSentOTP || 0;

        if (user.noSentOTP >= 3) {
          return resolve({
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.User.Register.EXCEED_MAX_SEND_OTP]
          });
        }

        const otpCode = this.userService.generateOTPCode();
        user.noSentOTP++;
        user.otpCodeConfirmAccount = otpCode;
        this.smsService.sendSMS([user.phone], `FlowerVietnam: Mã xác thục tài khoản: ${otpCode}`, '');
        await user.save();

        return resolve({
          status: HttpStatus.OK,
          messages: [ResponseMessages.User.Register.RESEND_OTP]
        });

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
