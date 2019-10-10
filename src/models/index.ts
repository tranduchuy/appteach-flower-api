import Address2 from './address.model';
import District from './district.model';
import User2 from './user.model';
import City from './city.model';
import Shop from './shop.model';

// Relation: City and User
City.hasMany(User2, {foreignKey: 'id', as: 'users'});
User2.belongsTo(City, {foreignKey: 'city', as: 'cityInfo', targetKey: 'id'});


// Relation: District and User
User2.belongsTo(District, {foreignKey: 'district', as: 'districtInfo', targetKey: 'id'});
District.hasMany(User2, { foreignKey: 'id', as: 'users'});

// Relation: City and District
// District.belongsTo(City, { foreignKey: 'CITIES_ID' });
// District.hasMany(Address2, { foreignKey: 'DISTRICT_ID' });

// Realtion: User and Address
User2.hasMany(Address2, {foreignKey: 'USERS_ID'});


// Realtion: User and Shop
Shop.hasMany(User2, {foreignKey: 'id', as: 'users'});
User2.belongsTo(Shop, {foreignKey: 'shop', as: 'shopInfo'});
