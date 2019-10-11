import Address2 from './address.model';
import District from './district.model';
import User from './user.model';
import City from './city.model';
import ShopHasProduct from './shop-has-product.model';
import Shop from './shop.model';
import Product from './product.model';
import ImageShop from './image-shop.model';
import ImageProduct from './image-product.model';

User.hasMany(Address2, { foreignKey: 'USERS_ID' });
District.belongsTo(City, { foreignKey: 'CITIES_ID' });
District.hasMany(Address2, { foreignKey: 'DISTRICT_ID' });
ShopHasProduct.belongsTo(Shop, { foreignKey: 'SHOPS_ID' });
ShopHasProduct.belongsTo(Product, { foreignKey: 'PRODUCTS_ID' });
Shop.hasMany(ShopHasProduct, { foreignKey: 'SHOPS_ID' });
Shop.hasMany(ImageShop, { foreignKey: 'SHOPS_ID' });
Product.hasMany(ShopHasProduct, { foreignKey: 'PRODUCTS_ID' });
Product.hasMany(ImageShop, { foreignKey: 'PRODUCTS_ID' });
ImageShop.belongsTo(Shop, { foreignKey: 'SHOPS_ID' });
ImageProduct.belongsTo(Product, { foreignKey: 'PRODUCTS_ID' });


District.hasMany(User, { foreignKey: 'district', as: 'users', sourceKey: 'id' });
User.belongsTo(District, { foreignKey: 'district', as: 'districtInfo', targetKey: 'id' });

City.hasMany(User, { foreignKey: 'city', as: 'users', sourceKey: 'id' });
User.belongsTo(City, { foreignKey: 'city', as: 'cityInfo', targetKey: 'id' });

Shop.hasMany(User, { foreignKey: 'shopsId', as: 'users', sourceKey: 'id'});
User.belongsTo(Shop, { foreignKey: 'shopsId', as: 'shopInfo', targetKey: 'id'});
