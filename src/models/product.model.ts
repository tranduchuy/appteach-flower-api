import { Model, DataTypes } from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';

class Product2 extends Model {
    id: number;
    title!: string;
    sku: string;
    description: string;
    priceRange: number;
    slug: string;
    seoUrl: string;
    seoDescription: string;
    seoTitle: string;
    originalPrice: number;
    saleOffPrice: number;
    saleOffStartDate: Date;
    saleOffEndDate: Date;
    saleOffActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    view: number;
    status: number;
    quantitySold: number;
    sold: number;
    freeShip: boolean;
    approvedStatus: number;
}

Product2.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        field: 'ID',
        primaryKey: true,
        unique: true,
        allowNull: false,
        autoIncrement: true
    },
    title: {
        field: 'TITLE',
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        field: 'DESCRIPTION',
        type: DataTypes.STRING(255),
    },
    priceRange: {
        field: 'PRICE_RANGE',
        type: DataTypes.INTEGER
    },
    slug: {
        field: 'SLUG',
        type: DataTypes.STRING(255)
    },
    seoUrl: {
        field: 'SEO_URL',
        type: DataTypes.STRING
    },
    seoDescription: {
        field: 'SEO_DESCRIPTION',
        type: DataTypes.STRING(255)
    },
    seoTitle: {
        field: 'SEO_TITLE',
        type: DataTypes.STRING(255)
    },
    originalPrice: {
        field: 'ORIGINAL_PRICE',
        type: DataTypes.INTEGER
    },
    saleOffPrice: {
        field: 'SALE_OFF_PRICE',
        type: DataTypes.INTEGER
    },
    saleOffStartDate: {
        field: 'SALE_OFF_START_DATE',
        type: DataTypes.DATE
    },
    saleOffEndDate: {
        field: 'SALE_OFF_END_DATE',
        type: DataTypes.DATE
    },
    saleOffActive: {
        field: 'SALE_OFF_ACTIVE',
        type: DataTypes.TINYINT
    },
    createdAt: {
        field: 'CREATED_AT',
        type: DataTypes.DATE
    },
    updatedAt: {
        field: 'UPDATED_AT',
        type: DataTypes.DATE
    },
    view: {
        field: 'VIEW',
        type: DataTypes.INTEGER
    },
    status: {
        field: 'STATUS',
        type: DataTypes.INTEGER
    },
    quantitySold: {
        field: 'QUANTITY_SOLD',
        type: DataTypes.INTEGER
    },
    sold: {
        field: 'SOLD',
        type: DataTypes.INTEGER
    },
    freeShip: {
        field: 'FREE_SHIP',
        type: DataTypes.TINYINT
    },
    approvedStatus: {
        field: 'APPROVED_STATUS',
        type: DataTypes.INTEGER
    }
}, {
        sequelize: MYSQL_CONNECTION,
        tableName: 'PRODUCTS',
        freezeTableName: true,
        timestamps: false
    });

export default Product2;