import Address2 from './address.model';
import AttributeValue from './attribute-value.model';
import Attribute from './attribute.model';
import District from './district.model';
import User from './user.model';
import City from './city.model';
import ShopHasProduct from './shop-has-product.model';
import Shop from './shop.model';
import Product from './product.model';
import ImageShop from './image-shop.model';
import ImageProduct from './image-product.model';

User.hasMany(Address2, { foreignKey: 'usersId', as: 'addressInfo', sourceKey: 'id' });
Address2.belongsTo(User, { foreignKey: 'usersId', as: 'userInfo', targetKey: 'id' });

District.hasMany(Address2, { foreignKey: 'districtsId', as: 'addressInfo', sourceKey: 'id' });
Address2.belongsTo(District, { foreignKey: 'districtsId', as: 'districtInfo', targetKey: 'id' });

District.hasMany(User, { foreignKey: 'district', as: 'users', sourceKey: 'id' });
User.belongsTo(District, { foreignKey: 'district', as: 'districtInfo', targetKey: 'id' });

City.hasMany(User, { foreignKey: 'city', as: 'userInfo', sourceKey: 'id' });
User.belongsTo(City, { foreignKey: 'city', as: 'cityInfo', targetKey: 'id' });

City.hasMany(District, { foreignKey: 'citiesId', as: 'districtInfo', sourceKey: 'id' });
District.belongsTo(City, { foreignKey: 'citiesId', as: 'cityInfo', targetKey: 'id' });

Shop.hasMany(User, { foreignKey: 'shopsId', as: 'userInfo', sourceKey: 'id' });
User.belongsTo(Shop, { foreignKey: 'shopsId', as: 'shopInfo', targetKey: 'id' });

Shop.hasMany(ShopHasProduct, { foreignKey: 'shopsId', as: 'shopHasProductInfo', sourceKey: 'id' });
ShopHasProduct.belongsTo(Shop, { foreignKey: 'shopsId', as: 'shopInfo', targetKey: 'id' });

Shop.hasMany(ImageShop, { foreignKey: 'shopsId', as: 'imageShopInfo', sourceKey: 'id' });
ImageShop.belongsTo(Shop, { foreignKey: 'shopsId', as: 'shopInfo', targetKey: 'id' });

Product.hasMany(ShopHasProduct, { foreignKey: 'productsId', as: 'shopHasProductInfo', sourceKey: 'id' });
ShopHasProduct.belongsTo(Product, { foreignKey: 'productsId', as: 'productInfo', targetKey: 'id' });

Product.hasMany(ImageProduct, { foreignKey: 'productsId', as: 'imageShopInfo', sourceKey: 'id' });
ImageProduct.belongsTo(Product, { foreignKey: 'productsId', as: 'productInfo', targetKey: 'id' });

Attribute.hasMany(AttributeValue, { foreignKey: 'attributesId', as: 'attributeValueInfo', sourceKey: 'id' });
AttributeValue.belongsTo(Attribute, { foreignKey: 'attributesId', as: 'attributeInfo', targetKey: 'id' });
