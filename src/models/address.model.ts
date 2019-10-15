import { Model, DataTypes } from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';

class Address extends Model {
    id!: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    type: number;
    longitude: number;
    latitude: number;
    usersId!: number;
    shopsId!: number;
    citiesId: number;
    districtsId: number;
}

Address.init({
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
    },
    email: {
        field: 'EMAIL',
        type: DataTypes.STRING(255),
    },
    phone: {
        field: 'PHONE',
        type: DataTypes.STRING(11),
    },
    address: {
        field: 'ADDRESS',
        type: DataTypes.STRING(255),
    },
    type: {
        field: 'TYPE',
        type: DataTypes.INTEGER,
        defaultValue: null
    },
    longitude: {
        field: 'LONGITUDE',
        type: DataTypes.DECIMAL,
        defaultValue: 0
    },
    latitude: {
        field: 'LATITUDE',
        type: DataTypes.DECIMAL,
        defaultValue: 0
    },
    usersId: {
        field: 'USERS_ID',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    shopsId: {
        field: 'SHOPS_ID',
        type: DataTypes.INTEGER,
        allowNull: false
    },
    citiesId: {
        field: 'CITIES_ID',
        type: DataTypes.INTEGER.UNSIGNED,
    },
    districtsId: {
        field: 'DISTRICTS_ID',
        type: DataTypes.INTEGER.UNSIGNED,
    }
}, {
        sequelize: MYSQL_CONNECTION,
        tableName: 'ADDRESSES',
        freezeTableName: true,
        timestamps: false
    });

export default Address;