import {
  controller, httpGet, httpPost
} from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../constant/types';
import { Request, Response } from 'express';
import { IRes } from '../interfaces/i-res';
import UserModel, { User } from '../models/user';
import { UserService } from '../services/user.service';
import { General } from '../constant/generals';
import UserRoles = General.UserRoles;
import { Status } from '../constant/status';
import UserTypes = General.UserTypes;
import Genders = General.Genders;
import { MailerService } from '../services/mailer.service';
import RegisterByTypes = General.RegisterByTypes;
import * as HttpStatus from 'http-status-codes';
import Joi from '@hapi/joi';
// validate schema
import loginSchema from '../validation-schemas/user/login.schema';
import loginGoogleSchema from '../validation-schemas/user/login-google.schema';
import registerSchema from '../validation-schemas/user/register.schema';
import { ResponseMessages } from '../constant/messages';

@controller('/user')
export class UserController {
  constructor(
    @inject(TYPES.UserService) private userService: UserService,
    @inject(TYPES.MailerService) private mailerService: MailerService
  ) {
  }

  @httpGet('/info', TYPES.CheckTokenMiddleware)
  public getLoggedInInfo(request: Request): Promise<IRes<User>> {
    return new Promise<IRes<User>>((resolve => {

      const user: User = JSON.parse(JSON.stringify(<User>request.user));
      delete user.passwordHash;
      delete user.passwordSalt;
      delete user.passwordReminderExpire;
      delete user.passwordReminderToken;

      const result: IRes<User> = {
        status: 1,
        messages: [ResponseMessages.SUCCESS],
        data: user
      };

      resolve(result);
    }));
  }

  @httpGet('/')
  public getUsers(request: Request, response: Response): Promise<IRes<User[]>> {
    return new Promise<IRes<User[]>>(async (resolve, reject) => {

      const result: IRes<User[]> = {
        status: 1,
        messages: [ResponseMessages.SUCCESS],
        data: await UserModel.find()
      };

      resolve(result);
    });
  }

  @httpPost('/register')
  public registerNewUser(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const {error} = Joi.validate(request.body, registerSchema);
        if (error) {
          let messages = error.details.map(detail => {
            return detail.message;
          });
          const result: IRes<{}> = {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            messages: messages,
            data: {}
          };
          return resolve(result);
        }
        const {
          email, password, confirmedPassword,
          name, username, phone, address, gender, city, district, ward
        } = request.body;

        const duplicatedPhones = await UserModel.find({phone: phone});
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

        const duplicatedUsers = await UserModel.find({email: email});
        if (duplicatedUsers.length !== 0) {
          const result: IRes<{}> = {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            messages: [ResponseMessages.User.Register.EMAIL_DUPLICATED],
            data: {}
          };
          return resolve(result);
        }

        const duplicatedUsernames = await UserModel.find({username: username});
        if (duplicatedUsernames.length !== 0) {
          const result: IRes<{}> = {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            messages: [ResponseMessages.User.Register.USERNAME_DUPLICATED],
            data: {}
          };
          return resolve(result);
        }

        let _gender;

        if (isNaN(gender)) {
          _gender = null;
        } else {
          _gender = gender;
          if (gender === 0) {
            _gender = Genders.GENDER_FEMALE;
          }
        }

        const newUserData = {
          email,
          username,
          name,
          password,
          type: UserTypes.TYPE_CUSTOMER,
          role: null,
          phone: phone || null,
          gender: _gender,
          city: city || null,
          district: district || null,
          ward: ward || null,
          registerBy: RegisterByTypes.NORMAL,
          address
        };

        const newUser = await this.userService.createUser(newUserData);

        if (request.user && [UserRoles.USER_ROLE_MASTER, UserRoles.USER_ROLE_ADMIN].some(request.user.role)) {
          newUser.status = Status.ACTIVE;
          newUser.tokenEmailConfirm = '';
          await newUser.save();
        } else {
          // Send email
          this.mailerService.sendConfirmEmail(email, newUser.tokenEmailConfirm);
        }

        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.User.Register.REGISTER_SUCCESS],
          data: {
            meta: {},
            entries: [{email, name, username, phone, address, gender, city, district, ward}]
          }
        };

        resolve(result);
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });
        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages,
          data: {
            meta: {},
            entries: []
          }
        };
        resolve(result);
      }
    });
  }

  @httpPost('/login')
  public login(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const {error} = Joi.validate(request.body, loginSchema);
        if (error) {
          let messages = error.details.map(detail => {
            return detail.message;
          });
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages,
            data: {}
          };
          return resolve(result);
        }

        const {email, username, password} = request.body;
        const user = await this.userService.findByEmailOrUsername(email, username);

        if (!user) {
          const result: IRes<{}> = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.User.Login.USER_NOT_FOUND],
            data: {}
          };
          return resolve(result);
        }

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
            registerBy: user.registerBy
          }
        ;
        const token = this.userService.generateToken({email: user.email});

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

        resolve(result);
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });
        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages,
          data: {}
        };
        resolve(result);
      }
    });
  }

  @httpPost('/login-by-google')
  public loginByGoogle(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const {error} = Joi.validate(request.body, loginGoogleSchema);
        if (error) {
          let messages = error.details.map(detail => {
            return detail.message;
          });
          const result: IRes<{}> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages,
            data: {}
          };
          return resolve(result);
        }

        const {email, googleId, name} = request.body;
        let user = await this.userService.findByGoogleId(googleId);


        if (!user) {
          user = await this.userService.findByEmail(email);
          if (user) {
            user = await this.userService.updateGoogleId(user, googleId);
          } else {
            const newUser = {
              name,
              email,
              googleId
            };
            user = await this.userService.createUserByGoogle(newUser);
          }
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
        const token = this.userService.generateToken({email: user.email});

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

        resolve(result);
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });
        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages,
          data: {}
        };
        resolve(result);
      }
    });
  }

  @httpGet('/account-confirm')
  public confirm(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const {token} = request.query;

        const user = await UserModel.findOne({
          tokenEmailConfirm: token
        });

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

        resolve(result);

      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });
        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages,
          data: {}
        };
        resolve(result);
      }
    });
  }
}