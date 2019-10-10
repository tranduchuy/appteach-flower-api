import { DataTypes, Model } from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';

export class ShopHasProduct extends Model {
    productsId!: number;
    shopsId!: number;
}

ShopHasProduct.init({
    productsId: {
        field: 'PRODUCTS_ID',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        unique: true,
        allowNull: false
    },
    shopsId: {
        field: 'SHOPS_ID',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        unique: true,
        allowNull: false
    }
}, {
    sequelize: MYSQL_CONNECTION,
    tableName: 'SHOPS_HAS_PRODUCTS',
    freezeTableName: true,
    timestamps: false
});

export default ShopHasProduct;