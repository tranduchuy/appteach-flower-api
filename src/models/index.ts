import Address2 from './address.model';
import District from './district.model';
import User2 from './user.model';
import City from './city.model';
import ShopHasProduct from './shop-has-product.model';
import Shop2 from './shop.model';
import Product2 from './product.model';

City.hasMany(User2, { foreignKey: 'id', as: 'users' });
User2.hasMany(Address2, { foreignKey: 'USERS_ID' });
User2.belongsTo(City, { foreignKey: 'city', as: 'cityInfo', targetKey: 'id' });
User2.hasOne(District, { foreignKey: 'ID', as: 'district' });
District.belongsTo(City, { foreignKey: 'CITIES_ID' });
District.hasMany(User2, { foreignKey: 'DISTRICT' });
District.hasMany(Address2, { foreignKey: 'DISTRICT_ID' });
ShopHasProduct.belongsTo(Shop2, { foreignKey: 'SHOPS_ID' });
ShopHasProduct.belongsTo(Product2, { foreignKey: 'PRODUCTS_ID' });
Shop2.hasMany(ShopHasProduct, { foreignKey: 'SHOPS_ID' });
Product2.hasMany(ShopHasProduct, { foreignKey: 'PRODUCTS_ID' });
