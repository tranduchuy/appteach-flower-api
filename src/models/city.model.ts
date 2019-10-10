import { Model, DataTypes } from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';
import User2 from './user.model';
import Address2 from './address.model';

class City extends Model {
  id: number;
  code: string;
  name: string;
}

City.init({
  id: {
    field: 'ID',
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    allowNull: false,
    type: DataTypes.INTEGER.UNSIGNED,
  },
  code: {
    field: 'CODE',
    type: DataTypes.STRING(3),
    allowNull: false,
    unique: true
  },
  name: {
    field: 'NAME',
    allowNull: false,
    type: DataTypes.STRING(255)
  }
}, {
    sequelize: MYSQL_CONNECTION,
    tableName: 'CITIES',
    freezeTableName: true,
    timestamps: false
  });

City.hasMany(User2, { foreignKey: 'CITY' });
City.hasMany(Address2, { foreignKey: 'CITIES_ID' });

export default City;
