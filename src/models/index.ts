import Address from './address.model';
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
import Order from './order.model';
import PriceRange from './price-range.model';
import ProductHasAttributeValue from './product-has-attribute-value.model';
import SaleOffProduct from './sale-off-product.model';
import TagHasUser from './tag-has-user.model';
import Tag from './tag.model';
import OrderItem from './order-item.model';

User.hasMany(Address, { foreignKey: 'usersId', as: 'addressInfo', sourceKey: 'id' });
Address.belongsTo(User, { foreignKey: 'usersId', as: 'userInfo', targetKey: 'id' });

User.hasMany(Order, { foreignKey: 'usersId', as: 'orderInfo', sourceKey: 'id' });
Order.belongsTo(User, { foreignKey: 'usersId', as: 'userInfo', targetKey: 'id' });

User.hasMany(TagHasUser, { foreignKey: 'usersId', as: 'tagHasUserInfo', sourceKey: 'id' });
TagHasUser.belongsTo(User, { foreignKey: 'usersId', as: 'userInfo', targetKey: 'id' });

District.hasMany(Address, { foreignKey: 'districtsId', as: 'addressInfo', sourceKey: 'id' });
Address.belongsTo(District, { foreignKey: 'districtsId', as: 'districtInfo', targetKey: 'id' });

District.hasMany(User, { foreignKey: 'district', as: 'users', sourceKey: 'id' });
User.belongsTo(District, { foreignKey: 'district', as: 'districtInfo', targetKey: 'id' });

City.hasMany(User, { foreignKey: 'city', as: 'userInfo', sourceKey: 'id' });
User.belongsTo(City, { foreignKey: 'city', as: 'cityInfo', targetKey: 'id' });

City.hasMany(District, { foreignKey: 'citiesId', as: 'districtInfo', sourceKey: 'id' });
District.belongsTo(City, { foreignKey: 'citiesId', as: 'cityInfo', targetKey: 'id' });

Address.hasMany(Order, { foreignKey: 'addressesId', as: 'orderInfo', sourceKey: 'id' });
Order.belongsTo(Address, { foreignKey: 'addressesId', as: 'addressInfo', targetKey: 'id' });

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

Product.hasMany(OrderItem, { foreignKey: 'productsId', as: 'orderItemInfo', sourceKey: 'id' });
OrderItem.belongsTo(Product, { foreignKey: 'productsId', as: 'productInfo', targetKey: 'id' });

Product.hasOne(SaleOffProduct, { foreignKey: 'productsId', as: 'saleOffProductInfo', sourceKey: 'id' });
SaleOffProduct.belongsTo(Product, { foreignKey: 'productsId', as: 'productInfo', targetKey: 'id' });

Product.hasMany(ProductHasAttributeValue, { foreignKey: 'productsId', as: 'productHasAttributeInfo', sourceKey: 'id' });
ProductHasAttributeValue.belongsTo(Product, { foreignKey: 'productsId', as: 'productInfo', targetKey: 'id' });

Order.hasMany(OrderItem, { foreignKey: 'ordersId', as: 'orderItemInfo', sourceKey: 'id' });
OrderItem.belongsTo(Order, { foreignKey: 'ordersId', as: 'orderInfo', targetKey: 'id' });

PriceRange.hasMany(Product, { foreignKey: 'priceRange', as: 'productInfo', sourceKey: 'id' });
Product.belongsTo(PriceRange, { foreignKey: 'priceRange', as: 'priceRangeInfo', targetKey: 'id' });

Tag.hasMany(TagHasUser, { foreignKey: 'tagsId', as: 'tagHasUserInfo', sourceKey: 'id' });
TagHasUser.belongsTo(Tag, { foreignKey: 'tagsId', as: 'tagInfo', targetKey: 'id' });

Attribute.hasMany(AttributeValue, { foreignKey: 'attributesId', as: 'attributeValueInfo', sourceKey: 'id' });
AttributeValue.belongsTo(Attribute, { foreignKey: 'attributesId', as: 'attributeInfo', targetKey: 'id' });

AttributeValue.hasMany(ProductHasAttributeValue, { foreignKey: 'attributeValuesId', as: 'productHasAttributeInfo', sourceKey: 'id' });
ProductHasAttributeValue.belongsTo(AttributeValue, { foreignKey: 'attributeValuesId', as: 'attributeValueInfo', targetKey: 'id' });