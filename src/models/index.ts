import Address2 from './address.model';
import District from './district.model';
import User2 from './user.model';
import City from './city.model';

City.hasMany(User2, {foreignKey: 'id', as: 'users'});
User2.hasMany(Address2, {foreignKey: 'USERS_ID'});
User2.belongsTo(City, {foreignKey: 'city', as: 'cityInfo', targetKey: 'id'});
User2.hasOne(District, {foreignKey: 'ID', as: 'district'});
District.belongsTo(City, { foreignKey: 'CITIES_ID' });
District.hasMany(User2, { foreignKey: 'DISTRICT' });
District.hasMany(Address2, { foreignKey: 'DISTRICT_ID' });
