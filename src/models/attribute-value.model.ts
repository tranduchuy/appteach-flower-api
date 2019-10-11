import { DataTypes, Model } from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';

class AttributeValue extends Model {
  id!: number;
  name: string;
  attributesId: number;
}

AttributeValue.init({
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
  attributesId: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: 'ATTRIBUTES_ID'
  }
}, {
  tableName: 'ATTRIBUTES',
  freezeTableName: true,
  sequelize: MYSQL_CONNECTION,
  timestamps: false,
  modelName: 'attribute'
});

export default AttributeValue;
