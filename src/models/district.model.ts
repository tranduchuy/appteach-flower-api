import { Model, DataTypes } from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';
import City from './city.model';
import User2 from './user.model';
import Address2 from './address.model';

class District extends Model {
  id: number;
  code: number;
  name: string;
  pre: string;
  citiesId: number;
}

District.init({
  id: {
    field: 'ID',
    primaryKey: true,
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.INTEGER,
    field: 'CODE'
  },
  name: {
    type: DataTypes.STRING(255),
    field: 'NAME'
  },
  pre: {
    type: DataTypes.STRING(255),
    field: 'PRE'
  },
  citiesId: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: 'CITIES_ID'
  },
}, {
    tableName: 'DISTRICTS',
    freezeTableName: true,
    sequelize: MYSQL_CONNECTION,
    timestamps: false
  });

District.belongsTo(City, { foreignKey: 'CITIES_ID' });
District.hasMany(User2, { foreignKey: 'DISTRICT' });
District.hasMany(Address2, { foreignKey: 'DISTRICT_ID' });

export default District;
