import { Model, DataTypes } from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';
import District from './district.model';

export class City extends Model {
  id: number;
  code: string;
  name: string;
}

City.init({
  id: {
    field: 'ID',
    autoIncrement: true,
    unique: true,
    allowNull: false,
    type: DataTypes.INTEGER.UNSIGNED
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
  freezeTableName: true
});

City.hasMany(District, {foreignKey: 'CITIES_ID'});

export default City;
