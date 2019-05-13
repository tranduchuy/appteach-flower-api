import { injectable } from 'inversify';
import UserModel, { User } from '../models/user';
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

  createUser = async ({ email, password, type, name, username, phone, address, city, district, ward, registerBy, gender, role }) => {
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
      username,
      phone,
      tokenEmailConfirm,
      registerBy,
      status: Status.PENDING_OR_WAIT_CONFIRM,
      address: address || '',
      city: city || null,
      district: district || null,
      ward: ward || null,
      gender: gender || null,
      role: role || UserRoles.USER_ROLE_ENDUSER
    });

    return await newUser.save();

  };

  updateUser = async (user, {
    newPassword, name, phone, address, city, district, ward, birthday, gender, avatar
  }) => {
    try {
      const userId = user._id;

      let passwordHash = null;
      if(newPassword){
        passwordHash = bcrypt.hashSync(newPassword, user.passwordSalt);
      }

      const newUser = {
        name: name || null,
        avatar: avatar ? avatar[0].link : null,
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
      return await UserModel.findOneAndUpdate({_id: userId}, newUser);
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
      status: Status.ACTIVE,
      address: null,
      city: null,
      district: null,
      ward: null,
      gender: null,
      role: UserRoles.USER_ROLE_ENDUSER,
      googleId
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

  updateGoogleId = async (user, googleId) => {
    user.googleId = googleId;
    return await user.save();
  };

  async findById(id: string): Promise<User> {
    return await UserModel.findById(id);
  }

  findByEmail = async (email) => {
    return await UserModel.findOne({ email: email });
  };

  findByGoogleId = async (googleId) => {
    return await UserModel.findOne({ googleId: googleId });
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
  }

  findUserByPasswordReminderToken = async (passwordReminderToken) => {
    return await UserModel.findOne({
      passwordReminderToken: passwordReminderToken
    });
  }


}
