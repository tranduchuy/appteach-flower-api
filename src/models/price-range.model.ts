import { Model, DataTypes } from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';

class PriceRange extends Model {
    id!: number;
    name!: string;
    value!: number;
    min: number;
    max: number;
}

PriceRange.init({
    id: {
        field: 'ID',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        unique: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        field: 'NAME',
        type: DataTypes.STRING(255),
        allowNull: false
    },
    value: {
        field: 'VALUE',
        type: DataTypes.INTEGER,
        unique: true,
    },
    min: {
        field: 'MIN',
        type: DataTypes.BIGINT,
        defaultValue: null
    },
    max: {
        field: 'MAX',
        type: DataTypes.BIGINT,
        defaultValue: null
    }
}, {
    sequelize: MYSQL_CONNECTION,
    tableName: 'PRICE_RANGES',
    freezeTableName: true,
    timestamps: false,
    modelName: 'priceRange'
});

export default PriceRange;