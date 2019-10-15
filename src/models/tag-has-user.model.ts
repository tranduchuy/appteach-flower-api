import { Model, DataTypes } from 'sequelize';
import { MYSQL_CONNECTION } from '../utils/secrets';

class TagHasUser extends Model {
    tagsId!: number;
    usersId!: number;
}

TagHasUser.init({
    tagsId: {
        field: 'TAGS_ID',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
    },
    usersId: {
        field: 'USERS_ID',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false
    }
}, {
    sequelize: MYSQL_CONNECTION,
    tableName: 'TAGS_HAS_USERS',
    freezeTableName: true,
    timestamps: false
});

export default TagHasUser;