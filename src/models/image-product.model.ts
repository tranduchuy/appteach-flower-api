import { DataTypes, Model } from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';
import Product2 from './product.model';

export class ImageProduct extends Model {
  imageUrl!: string;
  productsId!: number;
}

ImageProduct.init({
  imageUrl: {
    field: 'IMAGE_URL',
    type: DataTypes.TEXT({length: 'long'}),
    allowNull: false
  },
  productsId: {
    field: 'PRODUCTS_ID',
    allowNull: false,
    type: DataTypes.INTEGER.UNSIGNED
  }
}, {
  tableName: 'IMAGES_PRODUCTS',
  freezeTableName: true,
  sequelize: MYSQL_CONNECTION,
  timestamps: false
});

ImageProduct.removeAttribute('id');

ImageProduct.belongsTo(Product2, {foreignKey: 'PRODUCTS_ID'});

export default ImageProduct;
