const TYPES = {
  MongoDBClient: Symbol.for('MongoDBClient'),

  UserController: Symbol.for('UserController'),
  ProductController: Symbol.for('ProductController'),
  SearchController: Symbol.for('SearchController'),
  AddressController: Symbol.for('AddressController'),

  MailerService: Symbol.for('MailerService'),
  UserService: Symbol.for('UserService'),
  ProductService: Symbol.for('ProductService'),
  SearchService: Symbol.for('SearchService'),
  ImageService: Symbol.for('ImageService'),
  AddressService: Symbol.for('AddressService'),
  ShopService: Symbol.for('ShopService'),

  CheckTokenMiddleware: Symbol.for('CheckTokenMiddleware'),
  CheckAdminMiddleware: Symbol.for('CheckAdminMiddleware'),
  CheckMasterMiddleware: Symbol.for('CheckMasterMiddleware'),

  Admin: {
    UserController: Symbol.for('AdminUserController'),
    ProductController: Symbol.for('AdminProductController')
  }
};

export default TYPES;
