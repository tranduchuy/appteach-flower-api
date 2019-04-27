import { General } from '../constant/generals';
import { UserConstant } from '../constant/users';
import UserModel from '../models/user';
import bcrypt from 'bcrypt';
import UserRoles = General.UserRoles;
import UserTypes = General.UserTypes;
import RegisterByTypes = General.RegisterByTypes;

async function createMaster() {
  let master = await UserModel.findOne({email: 'master@gmail.com'});
  if (!master) {
    const salt = bcrypt.genSaltSync(UserConstant.saltLength);
    const password = '@master2019';

    master = new UserModel({
      name: 'master',
      username: 'master',
      email: 'master@gmail.com',
      passwordSalt: salt,
      passwordHash: bcrypt.hashSync(password, salt),
      role: UserRoles.USER_ROLE_MASTER,
      type: UserTypes.TYPE_CUSTOMER,
      createdAt: new Date(),
      updatedAt: new Date(),
      registerBy: RegisterByTypes.NORMAL,
      phone: '9999999999'
    });

    await master.save();
  }
}

async function createAdmin() {
  let admin = await UserModel.findOne({email: 'admin1@gmail.com'});

  if (!admin) {
    const salt = bcrypt.genSaltSync(UserConstant.saltLength);
    const password = 'admin123456';

    admin = new UserModel({
      name: 'admin1',
      username: 'admin1',
      email: 'admin1@gmail.com',
      passwordSalt: salt,
      passwordHash: bcrypt.hashSync(password, salt),
      role: UserRoles.USER_ROLE_ADMIN,
      type: UserTypes.TYPE_CUSTOMER,
      createdAt: new Date(),
      updatedAt: new Date(),
      registerBy: RegisterByTypes.NORMAL,
      phone: '8888888888'
    });

    await admin.save();
  }
}

export const run = async () => {
  await createMaster();
  await createAdmin();
};