import {
  controller, httpGet, httpPost
} from 'inversify-express-utils';
import {inject} from 'inversify';
import TYPES from '../constant/types';
import {Request, Response} from "express";
import UserModel, {User} from '../models/user';
import {UserService} from '../services/user.service';
import {General} from "../constant/generals";
import UserRoles = General.UserRoles;
import {Status} from "../constant/status";
import UserTypes = General.UserTypes;
import {HttpCodes} from "../constant/http-codes";
import Genders = General.Genders;
import {MailerService} from "../services/mailer.service";
import RegisterByTypes = General.RegisterByTypes;

import Joi from '@hapi/joi';
// validate schema
import loginSchema from '../validation-schemas/user/login.schema';
import registerSchema from '../validation-schemas/user/register.schema';

interface IRes<T> {
  status: Number;
  messages: string[];
  data: T;
}

@controller('/user')
export class UserController {
  constructor(
      @inject(TYPES.UserService) private userService: UserService,
      @inject(TYPES.MailerService) private mailerService: MailerService
  ) {
  }

  @httpGet("/")
  public getUsers(request: Request, response: Response): Promise<IRes<User[]>> {
    return new Promise<IRes<User[]>>(async (resolve, reject) => {

      const result: IRes<User[]> = {
        status: 1,
        messages: ["Success"],
        data: await UserModel.find()
      };

      resolve(result);
    });
  }

  @httpPost("/register")
  public registerNewUser(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const {error} = Joi.validate(request.body, registerSchema);
        if(error){
          let messages = error.details.map(detail =>{
            return detail.message;
          });
          const result: IRes<{}> = {
            status: HttpCodes.ERROR,
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
            status: HttpCodes.ERROR,
            messages: ["Duplicate phone"],
            data: {}
          };
          return resolve(result);
        }

        if (password !== confirmedPassword) {
          const result: IRes<{}> = {
            status: HttpCodes.ERROR,
            messages: ["2 passwords not same"],
            data: {}
          };
          return resolve(result);
        }

        const duplicatedUsers = await UserModel.find({email: email});
        if (duplicatedUsers.length !== 0) {
          const result: IRes<{}> = {
            status: HttpCodes.ERROR,
            messages: ["Duplicate email"],
            data: {}
          };
          return resolve(result);
        }

        const duplicatedUsernames = await UserModel.find({username: username});
        if (duplicatedUsernames.length !== 0) {
          const result: IRes<{}> = {
            status: HttpCodes.ERROR,
            messages: ["Duplicate username"],
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
          status: HttpCodes.SUCCESS,
          messages: ["Success"],
          data: {}
        };

        resolve(result);
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });
        const result: IRes<{}> = {
          status: HttpCodes.ERROR,
          messages: messages,
          data: {}
        };
        resolve(result);
      }
    });
  }

  @httpPost("/login")
  public login(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const {error} = Joi.validate(request.body, loginSchema);
        if(error){
          let messages = error.details.map(detail =>{
            return detail.message;
          });
          const result: IRes<{}> = {
            status: HttpCodes.ERROR,
            messages: messages,
            data: {}
          };
          return resolve(result);
        }

        const {email, username, password} = request.body;
        const user = await this.userService.findByEmailOrUsername(email, username);

        if (!user) {
          const result: IRes<{}> = {
            status: HttpCodes.ERROR,
            messages: ['User not found'],
            data: {}
          };
          return resolve(result);
        }

        if (!this.userService.isValidHashPassword(user.passwordHash, password)) {
          const result: IRes<{}> = {
            status: HttpCodes.ERROR,
            messages: ['Wrong password'],
            data: {}
          };
          return resolve(result);
        }

        if (user.status !== Status.ACTIVE) {
          const result: IRes<{}> = {
            status: HttpCodes.ERROR,
            messages: ['User inactive'],
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
          status: HttpCodes.SUCCESS,
          messages: ['Successfully'],
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
          status: HttpCodes.ERROR,
          messages: messages,
          data: {}
        };
        resolve(result);
      }
    });
  }

  @httpGet("/account-confirm")
  public confirm(request: Request, response: Response): Promise<IRes<{}>> {
    return new Promise<IRes<{}>>(async (resolve, reject) => {
      try {
        const {token} = request.query;

        const user = await UserModel.findOne({
          tokenEmailConfirm: token
        });

        if (!user) {
          const result: IRes<{}> = {
            status: HttpCodes.ERROR,
            messages: ['Invalid token'],
            data: {}
          };
          return resolve(result);
        }

        user.status = Status.ACTIVE;
        user.tokenEmailConfirm = '';

        await user.save();
        const result: IRes<{}> = {
          status: HttpCodes.SUCCESS,
          messages: ['Success'],
          data: {
            meta: {},
            entries: []
          }
        };

        resolve(result);

      }
      catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });
        const result: IRes<{}> = {
          status: HttpCodes.ERROR,
          messages: messages,
          data: {}
        };
        resolve(result);
      }
    });
  }
}