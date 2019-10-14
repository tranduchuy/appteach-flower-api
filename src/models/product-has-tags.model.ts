import { Model, DataTypes } from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';

class ProductHasTag extends Model {
    productsId!: number;
    tagsId!: number;
}

ProductHasTag.init({
    productsId: {
        field: 'PRODUCTS_ID',
        type: DataTypes.NUMBER.UNSIGNED,
        primaryKey: true
    },
    tagsId: {
        field: 'TAGS_ID',
        type: DataTypes.NUMBER.UNSIGNED,
        primaryKey: true
    }
}, {
    tableName: 'PRODUCTS_HAS_TAGS',
    freezeTableName: true,
    sequelize: MYSQL_CONNECTION,
    timestamps: false
});

export default ProductHasTag;

