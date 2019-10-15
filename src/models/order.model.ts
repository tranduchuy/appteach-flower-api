import { Model, DataTypes, NOW } from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';

export class Order extends Model {
    id!: number;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    paidAt: Date;
    note: string;
    deliveryTime: Date;
    total: number;
    code: string;
    usersId: number;
    addressesId: number;
}

Order.init({
    id: {
        field: 'ID',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    status: {
        field: 'STATUS',
        type: DataTypes.INTEGER,
        defaultValue: null
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
    paidAt: {
        field: 'PAID_AT',
        type: DataTypes.DATE,
        defaultValue: null
    },
    note: {
        field: 'NOTE',
        type: DataTypes.TEXT,
        defaultValue: null
    },
    deliveryTime: {
        field: 'DELIVERY_TIME',
        type: DataTypes.DATE,
        defaultValue: null
    },
    total: {
        field: 'TOTAL',
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    code: {
        field: 'CODE',
        type: DataTypes.STRING(255),
        defaultValue: null
    },
    usersId: {
        field: 'USERS_ID',
        type: DataTypes.INTEGER.UNSIGNED
    },
    addressesId: {
        field: 'ADDRESSES_ID',
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: null
    }
}, {
        sequelize: MYSQL_CONNECTION,
        tableName: 'ORDERS',
        freezeTableName: true,
        timestamps: false,
        modelName: 'order'
    });

export default Order;