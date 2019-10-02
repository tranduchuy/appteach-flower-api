import { Model, DataTypes } from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';
import City from './city.model';

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
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    autoIncrement: true
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
  sequelize: MYSQL_CONNECTION
});

District.belongsTo(City, {foreignKey: 'CITIES_ID'});

export default District;
