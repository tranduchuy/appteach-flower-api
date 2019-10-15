import { Model, DataTypes, NOW } from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';

export class OrderItem extends Model {
    id!: number;
    quantity: number;
    price: number;
    saleOffPrice: number;
    saleOffActive: boolean;
    saleOffEndDate: Date;
    saleOffStartDate: Date;
    title: string;
    originalPrice: number;
    createdAt: Date;
    updatedAt: Date;
    status: number;
    deliveredAt: Date;
    shippingCost: number;
    discount: number;
    shippingDistance: number;
    total: number;
    ordersId!: number;
    productsId!: number;
}

OrderItem.init({
    id: {
        field: 'ID',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        unique: true,
        allowNull: false,
        autoIncrement: true
    },
    quantity: {
        field: 'QUANTITY',
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0
    },
    price: {
        field: 'PRICE',
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0
    },
    saleOffPrice: {
        field: 'SALE_OFF_PRICE',
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0
    },
    saleOffActive: {
        field: 'SALE_OFF_ACTIVE',
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    saleOffEndDate: {
        field: 'SALE_OFF_END_DATE',
        type: DataTypes.DATE,
        defaultValue: null
    },
    saleOffStartDate: {
        field: 'SALE_OFF_START_DATE',
        type: DataTypes.DATE,
        defaultValue: null
    },
    title: {
        field: 'TITLE',
        type: DataTypes.STRING(255),
        defaultValue: ''
    },
    originalPrice: {
        field: 'ORIGINAL_PRICE',
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0
    },
    createdAt: {
        field: 'CREATED_AT',
        type: DataTypes.DATE,
        defaultValue: NOW
    },
    updatedAt: {
        field: 'UPDATED_AT',
        type: DataTypes.DATE,
        defaultValue: NOW
    },
    status: {
        field: 'STATUS',
        type: DataTypes.INTEGER,
        defaultValue: null
    },
    deliveredAt: {
        field: 'DELIVERED_AT',
        type: DataTypes.DATE,
        defaultValue: null
    },
    shippingCost: {
        field: 'SHIPPING_COST',
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: null
    },
    discount: {
        field: 'DISCOUNT',
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: null
    },
    shippingDistance: {
        field: 'SHIPPING_DISTANCE',
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: null
    },
    total: {
        field: 'TOTAL',
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: null
    },
    ordersId: {
        field: 'ORDERS_ID',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    productsId: {
        field: 'PRODUCTS_ID',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
        sequelize: MYSQL_CONNECTION,
        tableName: 'ORDER_ITEMS',
        freezeTableName: true,
        timestamps: false,
        modelName: 'orderItem'
    });

export default OrderItem;