const TYPES = {
  MongoDBClient: Symbol.for('MongoDBClient'),
  UserController: Symbol.for('UserController'),
  ProductController: Symbol.for('ProductController'),
  MailerService: Symbol.for('MailerService'),
  UserService: Symbol.for('UserService'),
  ProductService: Symbol.for('ProductService'),
  CheckTokenMiddleware: Symbol.for('CheckTokenMiddleware')
};

export default TYPES;
