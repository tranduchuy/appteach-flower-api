import { Model, DataTypes } from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';

export class Staff extends Model {
  id!: number;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User2 extends Staff {
  name: string;
  username: string;
  phone: string;
  gender: number;
  role!: number;
  type: number;
  status!: number;
  avatar: string;
  birthday: Date;
  address: string;
  ward: number;
  tokenEmailConfirm: string;
  passwordReminderToken: string;
  passwordReminderExpire: Date;
  googleId: string;
  facebookId: string;
  otpCodeConfirmAccount: string;
  noSendOtp: number;
  registerBy: number;
  roleInShop: number;
}

User2.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: 'ID',
    primaryKey: true,
    unique: true,
    allowNull: false,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(100),
    field: 'EMAIL',
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    field: 'NAME'
  },
  username: {
    type: DataTypes.STRING(100),
    field: 'USERNAME'
  },
  phone: {
    type: DataTypes.STRING(11),
    field: 'PHONE'
  },
  gender: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: 'GENDER'
  },
  role: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: 'ROLE',
    allowNull: false
  },
  type: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: 'TYPE'
  },
  status: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: 'STATUS',
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    field: 'AVATAR'
  },
  birthdayDate: {
    type: DataTypes.DATE,
    field: 'BIRTHDAY'
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'CREATED_AT'
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'UPDATED_AT'
  },
  passwordHash: {
    type: DataTypes.STRING,
    field: 'PASSWORD_HASH'
  },
  passwordSalt: {
    type: DataTypes.STRING,
    field: 'PASSWORD_SALT'
  },
  address: {
    type: DataTypes.STRING,
    field: 'ADDRESS'
  },
  // city: {
  //   type: DataTypes.INTEGER.UNSIGNED,
  //   field: 'CITY'
  // },
  ward: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: 'WARD'
  },
  // district: {
  //     type: DataTypes.INTEGER.UNSIGNED,
  //     field: 'DISTRICT'
  // },
  tokenEmailConfirm: {
    type: DataTypes.STRING,
    field: 'TOKEN_EMAIL_CONFIRM'
  },
  passwordReminderToken: {
    type: DataTypes.STRING,
    field: 'PASSWORD_REMINDER_TOKEN'
  },
  passwordReminderExpire: {
    type: DataTypes.DATE,
    field: 'PASSWORD_REMINDER_EXPIRE'
  },
  googleId: {
    type: DataTypes.STRING(45),
    field: 'GOOGLE_ID'
  },
  facebookId: {
    type: DataTypes.STRING(45),
    field: 'FACEBOOK_ID'
  },
  otpCodeConfirmAccount: {
    type: DataTypes.STRING(45),
    field: 'OTP_CODE_CONFIRM_ACCOUNT'
  },
  noSendOtp: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: 'NO_SEND_OTP'
  },
  registerBy: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: 'REGISTER_BY'
  },
  roleInShop: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: 'ROLE_IN_SHOP'
  }
}, {
  tableName: 'USERS',
  freezeTableName: true,
  sequelize: MYSQL_CONNECTION,
  timestamps: false,
  modelName: 'user'
});

export default User2;
