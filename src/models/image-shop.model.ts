import { DataTypes, Model } from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';
import Shop2 from './shop.model';

export class ImageShop extends Model {
  imageUrl!: string;
  shopsId!: number;
}

ImageShop.init({
  imageUrl: {
    field: 'IMAGE_URL',
    type: DataTypes.TEXT({length: 'long'}),
    allowNull: false
  },
  shopsId: {
    field: 'SHOPS_ID',
    allowNull: false,
    type: DataTypes.INTEGER.UNSIGNED
  }
}, {
  tableName: 'IMAGES_SHOPS',
  freezeTableName: true,
  sequelize: MYSQL_CONNECTION
});

ImageShop.belongsTo(Shop2, {foreignKey: 'SHOPS_ID'});

export default ImageShop;
