import { General } from '../constant/generals';
import { UserConstant } from '../constant/users';
import UserModel2 from '../models/user.model';
import { Status } from '../constant/status';
import bcrypt from 'bcrypt';
import UserRoles = General.UserRoles;
import UserTypes = General.UserTypes;
import RegisterByTypes = General.RegisterByTypes;

async function createMaster() {
  let master = await UserModel2.findOne({ where: { email: 'master@gmail.com' } });

  if (!master) {
    const salt = bcrypt.genSaltSync(UserConstant.saltLength);
    const password = 'master2019';

    master = new UserModel2({
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
      phone: '9999999999',
      status: Status.ACTIVE,
    });

    await master.save();
  }
}

async function createAdmin() {
  let admin = await UserModel2.findOne({ where: { email: 'admin1@gmail.com' } });

  if (!admin) {
    const salt = bcrypt.genSaltSync(UserConstant.saltLength);
    const password = 'admin123456';

    admin = new UserModel2({
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
      phone: '8888888888',
      status: Status.ACTIVE
    });

    await admin.save();
  }
}

export const run = async () => {
  await createMaster();
  await createAdmin();
};
