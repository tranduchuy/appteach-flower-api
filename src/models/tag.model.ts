import { Model, DataTypes } from 'sequelize';
import sequelize from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';

class Tag extends Model {
    id!: number;
    slug: string;
    customSlug?: string;
    keyword: string;
    refresh?: number; // TODO: what is it
    status: number;
    createdAt: Date;
    updatedAt: Date;
    metaTitle?: string;
    metaDescription?: string;
    metaUrl?: string;
    metaImage?: string;
    canonical?: string;
    textEndPage?: string;
}

Tag.init({
    id: {
        field: 'ID',
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        unique: true,
        primaryKey: true
    },
    slug: {
        field: 'SLUG',
        unique: true,
        type: DataTypes.STRING,
        allowNull: false
    },
    customSlug: {
        field: 'CUSTOM_SLUG',
        type: DataTypes.STRING,
        allowNull: true
    },
    keyword: {
        field: 'KEYWORD',
        type: DataTypes.STRING,
        unique: true
    },
    refresh: {
        field: 'REFRESH',
        type: DataTypes.INTEGER
    },
    createdAt: {
        field: 'CREATED_AT',
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW
    },
    updatedAt: {
        field: 'UPDATED_AT',
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW
    },
    metaTitle: {
        field: 'META_TITLE',
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },
    metaDescription: {
        field: 'META_DESCRIPTION',
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },
    metaUrl: {
        field: 'META_URL',
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },
    metaImage: {
        field: 'META_IMAGE',
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },
    canonical: {
        field: 'CANONICAL',
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },
    textEndPage: {
        field: 'TEXT_END_PAGE',
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    }
}, {
    tableName: 'TAGS',
    freezeTableName: true,
    sequelize: MYSQL_CONNECTION
});

export default Tag;