import { DataTypes, Model } from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';

class Attribute extends Model {
  id!: number;
  name!: string;
}

Attribute.init({
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
}, {
  tableName: 'ATTRIBUTES',
  freezeTableName: true,
  sequelize: MYSQL_CONNECTION,
  timestamps: false,
  modelName: 'attribute'
});

export default Attribute;
