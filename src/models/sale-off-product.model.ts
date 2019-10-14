import { Model, DataTypes, NOW } from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';
import { Status } from '../constant/status';

class SaleOffProduct extends Model {
  id!: number;
  productsId: number;
  status: number;
  price: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

SaleOffProduct.init(
  {
    id: {
      field: 'ID',
      type: DataTypes.NUMBER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    price: {
      field: 'PRICE',
      type: DataTypes.BIGINT
    },
    productsId: {
      field: 'PRODUCTS_ID',
      type: DataTypes.NUMBER.UNSIGNED,
      allowNull: false
    },
    status: {
      field: 'STATUS',
      type: DataTypes.TINYINT,
      defaultValue: Status.ACTIVE
    },
    startDate: {
      field: 'START_DATE',
      type: DataTypes.DATE,
      allowNull: true
    },
    endDate: {
      field: 'END_DATE',
      type: DataTypes.DATE,
      allowNull: true
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
    }
  },
  {
    tableName: 'SALE_OFF_PRODUCTS',
    freezeTableName: true,
    sequelize: MYSQL_CONNECTION,
    timestamps: true
  }
);

export default SaleOffProduct;
