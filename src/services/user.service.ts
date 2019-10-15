import { injectable } from 'inversify';
import City from '../models/city.model';
import District from '../models/district.model';
import Shop from '../models/shop.model';
import UserModel, { User } from '../models/user.model';
import { UserConstant } from '../constant/users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import RandomString from 'randomstring';
import { Status } from '../constant/status';
import { General } from '../constant/generals';
import UserRoles = General.UserRoles;
import UserTypes = General.UserTypes;
import RegisterByTypes = General.RegisterByTypes;
import * as Sequelize from 'sequelize';

export interface IQueryUser {
  limit: number;
  page: number;
  sortBy?: string;
  sortDirection?: string;
  userId?: string;
  email?: string;
  username?: string;
  googleId?: string;
  facebookId?: string;
  role?: number;
  status?: number;
  gender?: number;
}

@injectable()
export class UserService {
  sellerInProductDetailFields = ['_id', 'avatar', 'name', 'address'];

  createUser = async ({ email, password, type, name, phone, address, city, district, ward, registerBy, gender, role, otpCode, roleInShop, shopsId }) => {
    const salt = bcrypt.genSaltSync(UserConstant.saltLength);
    const tokenEmailConfirm = RandomString.generate({
      length: UserConstant.tokenConfirmEmailLength,
      charset: 'alphabetic'
    });

    const newUser = new UserModel({
      email,
      passwordHash: bcrypt.hashSync(password, salt),
      passwordSalt: salt,
      type,
      name,
      username: '',
      phone,
      tokenEmailConfirm,
      registerBy,
      status: Status.PENDING_OR_WAIT_CONFIRM,
      address: address || '',
      city: city || null,
      district: district || null,
      ward: ward || null,
      gender: gender || null,
      role: role || UserRoles.USER_ROLE_ENDUSER,
      otpCodeConfirmAccount: otpCode,
      googleId: null,
      facebookId: null,
      roleInShop,
      shopsId
    });

    return await newUser.save();
  };

  updateUser = async (user, {
    newPassword, name, phone, address, city, district, ward, birthday, gender, avatar
  }) => {
    try {
      const userId = user.id;

      let passwordHash = null;
      if (newPassword) {
        passwordHash = bcrypt.hashSync(newPassword, user.passwordSalt);
      }

      const newUser = {
        name: name || null,
        avatar: avatar ? avatar.link : null,
        phone: phone || null,
        birthday: birthday || null,
        address: address || null,
        passwordHash: passwordHash || null,
        city: city || null,
        district: district || null,
        ward: ward || null,
        gender: gender || null
      };

      Object.keys(newUser).map(key => {
        if (newUser[key] === null) {
          delete newUser[key];
        }
      });

      return await UserModel.update(
        newUser,
        {
          where: { id: userId }
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  createUserByGoogle = async ({ email, name, googleId }) => {

    const username = email.split('@')[0];

    const newUser = new UserModel({
      email,
      passwordHash: null,
      passwordSalt: null,
      type: UserTypes.TYPE_CUSTOMER,
      name,
      username: username,
      phone: null,
      tokenEmailConfirm: null,
      registerBy: RegisterByTypes.GOOGLE,
      status: Status.PENDING_OR_WAIT_CONFIRM,
      address: null,
      city: null,
      district: null,
      ward: null,
      gender: null,
      role: UserRoles.USER_ROLE_ENDUSER,
      googleId,
      facebookId: null
    });
    return await newUser.save();
  };

  createUserByFacebook = async ({ name, facebookId }) => {
    const newUser = new UserModel({
      passwordHash: null,
      passwordSalt: null,
      type: UserTypes.TYPE_CUSTOMER,
      name,
      username: null,
      phone: null,
      tokenEmailConfirm: null,
      registerBy: RegisterByTypes.FACEBOOK,
      status: Status.PENDING_OR_WAIT_CONFIRM,
      address: null,
      city: null,
      district: null,
      ward: null,
      gender: null,
      role: UserRoles.USER_ROLE_ENDUSER,
      facebookId,
      googleId: null
    });
    return await newUser.save();
  };

  generateToken = (data) => {
    const secretKey = General.jwtSecret;
    return jwt.sign(data, secretKey, {
      expiresIn: (60 * 60) * UserConstant.tokenExpiredInHour
    });
  };

  findByUsername = async (username: string) => {
    return await UserModel.findOne({ username });
  };

  findByEmailOrUsername = async (email, username) => {
    if (email) {
      return await this.findByEmail(email);
    }

    return await this.findByUsername(username);
  };

  findByEmailOrPhone = async (email, phone) => {
    return await UserModel.findOne({
      where: {
        [Sequelize.Op.or]: [{ email }, { phone }]
      }
    });
  };

  updateGoogleId = async (user, googleId) => {
    user.googleId = googleId;
    return await user.save();
  };

  updateOtpCode = async (user, otpCode) => {
    user.otpCodeConfirmAccount = otpCode;
    return await user.save();
  };

  updateFacebookId = async (user, facebookId) => {
    user.facebookId = facebookId;
    return await user.save();
  };
  findByEmail = async (email) => {
    return await UserModel.findOne({ where: { email } });
  };
  findByGoogleId = async (googleId) => {
    return await UserModel.findOne({ where: { googleId } });
  };
  findByFacebookId = async (facebookId) => {
    return await UserModel.findOne({ where: facebookId });
  };
  isValidHashPassword = (hashed: string, plainText: string) => {
    try {
      return bcrypt.compareSync(plainText, hashed);
    } catch (e) {
      return false;
    }
  };
  getSellerInProductDetail = async (id) => {
    return await UserModel.findOne({ _id: id }, this.sellerInProductDetailFields);
  };
  generateForgetPasswordToken = async (user) => {
    const reminderToken = RandomString.generate();
    const reminderExpired = moment().add(2, 'hours');

    user.passwordReminderToken = reminderToken;
    user.passwordReminderExpire = reminderExpired;

    return await user.save();
  };
  isExpiredTokenResetPassword = (expiredOn) => {
    return moment(expiredOn).isBefore(moment());
  };
  resetPassword = async (newPassword, user) => {
    user.passwordHash = bcrypt.hashSync(newPassword, user.passwordSalt);
    user.passwordReminderToken = '';
    return await user.save();
  };
  findUserByPasswordReminderToken = async (passwordReminderToken) => {
    return await UserModel.findOne({ where: { passwordReminderToken } });
  };

  async findById(id: string): Promise<User> {
    return await UserModel.findOne({ where: { id } });
  }

  async findByPhone(phone: string): Promise<User> {
    return await UserModel.findOne({ where: { phone } });
  }

  isRoleAdmin(role: number): boolean {
    return [
      UserRoles.USER_ROLE_ADMIN,
      UserRoles.USER_ROLE_MASTER
    ].some(r => r === role);
  }

  buildStageGetListUser(queryCondition: IQueryUser): any[] {
    const stages = [];
    const matchStage: any = {};

    if (queryCondition.userId) {
      matchStage['_id'] = queryCondition.userId;
    }

    if (queryCondition.username) {
      matchStage['username'] = queryCondition.username;
    }

    if (queryCondition.email) {
      matchStage['email'] = {
        $regex: queryCondition.email,
        $options: 'i'
      };
    }

    if (queryCondition.googleId) {
      matchStage['googleId'] = queryCondition.googleId;
    }

    if (queryCondition.facebookId) {
      matchStage['facebookId'] = queryCondition.facebookId;
    }

    if (queryCondition.gender) {
      matchStage['gender'] = queryCondition.gender;
    }

    if (queryCondition.role) {
      matchStage['role'] = queryCondition.role;
    }

    if (queryCondition.status) {
      matchStage['status'] = queryCondition.status;
    }

    if (Object.keys(matchStage).length > 0) {
      stages.push({ $match: matchStage });
    }

    if (queryCondition.sortBy) {
      stages.push({
        $sort: {
          [queryCondition.sortBy]: queryCondition.sortDirection === 'ASC' ? 1 : -1
        }
      });
    }

    stages.push({
      $facet: {
        entries: [
          { $skip: (queryCondition.page - 1) * queryCondition.limit },
          { $limit: queryCondition.limit }
        ],
        meta: [
          { $group: { _id: null, totalItems: { $sum: 1 } } },
        ],
      }
    });

    return stages;
  }

  generateOTPCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  getConditionQueryUserForAdmin(query: any): { [key: string]: any } {
    const cond: any = {};

    if (query.userId) {
      cond.id = query.userId;
    }

    if (query.email) {
      cond.email = query.email;
    }

    if (query.username) {
      cond.username = query.username;
    }

    if (query.googleId) {
      cond.googleId = query.googleId;
    }

    if (query.facebookId) {
      cond.facebookId = query.facebookId;
    }

    if (query.role) {
      cond.role = query.role;
    }

    return {
      where: cond,
      limit: query.limit,
      offset: query.limit * (query.page - 1),
      include: [
        { model: City, as: 'cityInfo' },
        { model: District, as: 'districtInfo' },
        { model: Shop, as: 'shopInfo' },
      ]
    };
  }
}
