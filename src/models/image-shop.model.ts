import { DataTypes, Model } from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';

export class ImageShop extends Model {
  imageUrl!: string;
  shopsId!: number;
}

ImageShop.init({
  imageUrl: {
    field: 'IMAGE_URL',
    type: DataTypes.STRING(1000),
    primaryKey: true,
    allowNull: false
  },
  shopsId: {
    field: 'SHOPS_ID',
    primaryKey: true,
    allowNull: false,
    type: DataTypes.INTEGER.UNSIGNED
  }
}, {
  tableName: 'IMAGES_SHOPS',
  freezeTableName: true,
  sequelize: MYSQL_CONNECTION,
  timestamps: false
});

export default ImageShop;
