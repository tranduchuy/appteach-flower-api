import { Model, DataTypes } from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';
// import User2 from './user.model';
// import Address2 from './address.model';

export class Shop2 extends Model {
  id!: number;
  name: string;
  slug!: string;
  status: number;
  availableShipCountry: boolean;
  createdAt: Date;
  updatedAt: Date;
  discountRate: number;
  usersId!: number;
}

Shop2.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: 'ID',
    primaryKey: true,
    unique: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    field: 'NAME'
  },
  slug: {
    type: DataTypes.STRING(255),
    field: 'SLUG',
    unique: true
  },
  status: {
    type: DataTypes.NUMBER,
    field: 'STATUS',
  },
  availableShipCountry: {
    type: DataTypes.TINYINT,
    field: 'AVAILABLE_SHIP_COUNTRY'
  },
  createdAt: {
    field: 'CREATED_AT',
    type: DataTypes.DATE
  },
  updatedAt: {
    field: 'UPDATED_AT',
    type: DataTypes.DATE
  },
  discountRate: {
    field: 'DISCOUNT_RATE',
    type: DataTypes.FLOAT
  }
}, {
  tableName: 'SHOPS',
  freezeTableName: true,
  sequelize: MYSQL_CONNECTION,
  timestamps: false,
  modelName: 'shop'
});

// Shop2.belongsTo(User2, {
//   foreignKey: 'USERS_ID'
// });
// Shop2.hasMany(Address2, {
//   foreignKey: 'SHOPS_ID'
// });

export default Shop2;
