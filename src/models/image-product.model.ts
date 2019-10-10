import { DataTypes, Model } from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';

export class ImageProduct extends Model {
  imageUrl!: string;
  productsId!: number;
}

ImageProduct.init({
  imageUrl: {
    field: 'IMAGE_URL',
    type: DataTypes.STRING(1000),
    primaryKey: true,
    allowNull: false
  },
  productsId: {
    field: 'PRODUCTS_ID',
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER.UNSIGNED
  }
}, {
  tableName: 'IMAGES_PRODUCTS',
  freezeTableName: true,
  sequelize: MYSQL_CONNECTION,
  timestamps: false
});

ImageProduct.removeAttribute('id');

export default ImageProduct;
