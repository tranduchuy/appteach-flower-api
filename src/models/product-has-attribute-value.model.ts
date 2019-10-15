import { DataTypes, Model } from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';

class ProductHasAttributeValue extends Model {
  productsId: number;
  attributeValuesId: number;
}

ProductHasAttributeValue.init({
  productsId: {
    field: 'PRODUCTS_ID',
    type: DataTypes.INTEGER.UNSIGNED
  },
  attributeValuesId: {
    field: 'ATTRIBUTE_VALUES_ID',
    type: DataTypes.INTEGER.UNSIGNED
  }
}, {
  tableName: 'PRODUCTS_HAS_ATTRIBUTE_VALUES',
  freezeTableName: true,
  sequelize: MYSQL_CONNECTION,
  timestamps: false,
  modelName: 'productHasAttributeValue'
});

export default ProductHasAttributeValue;
