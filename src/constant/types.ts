const TYPES = {
  MongoDBClient: Symbol.for('MongoDBClient'),

  UserController: Symbol.for('UserController'),
  ProductController: Symbol.for('ProductController'),
  SearchController: Symbol.for('SearchController'),

  MailerService: Symbol.for('MailerService'),
  UserService: Symbol.for('UserService'),
  ProductService: Symbol.for('ProductService'),
  SearchService: Symbol.for('SearchService'),
  ImageService: Symbol.for('ImageService'),

  CheckTokenMiddleware: Symbol.for('CheckTokenMiddleware'),

  Admin: {
    UserController: Symbol.for('AdminUserController'),
    ProductController: Symbol.for('AdminProductController')
  }
};

export default TYPES;
