
const TYPES = {
  MongoDBClient: Symbol.for('MongoDBClient'),

  UserController: Symbol.for('UserController'),
  ProductController: Symbol.for('ProductController'),
  SearchController: Symbol.for('SearchController'),
  OrderController: Symbol.for('OrderController'),
  OrderItemController: Symbol.for('OrderItemController'),
  ShopController: Symbol.for('ShopController'),
  AddressController: Symbol.for('AddressController'),
  ShopStatisticController: Symbol.for('ShopStatisticController'),
  NotifyController: Symbol.for('NotifyController'),


  MailerService: Symbol.for('MailerService'),
  UserService: Symbol.for('UserService'),
  ProductService: Symbol.for('ProductService'),
  SearchService: Symbol.for('SearchService'),
  ImageService: Symbol.for('ImageService'),
  OrderService: Symbol.for('OrderService'),
  OrderItemService: Symbol.for('OrderItemService'),
  AddressService: Symbol.for('AddressService'),
  ShopService: Symbol.for('ShopService'),
  GoogleDistanceMatrixService: Symbol.for('GoogleDistanceMatrixService'),
  GoogleGeocodingService: Symbol.for('GoogleGeocodingService'),
  FacebookGraphApiService: Symbol.for('FacebookGraphApiService'),
  SystemConfigService: Symbol.for('SystemConfigService'),
  CostService: Symbol.for('CostService'),
  NotifyService: Symbol.for('NotifyService'),
  ProductWorkerService: Symbol.for('ProductWorkerService'),
  OrderWorkerService: Symbol.for('OrderWorkerService'),

  CheckTokenMiddleware: Symbol.for('CheckTokenMiddleware'),
  CheckAdminMiddleware: Symbol.for('CheckAdminMiddleware'),
  CheckMasterMiddleware: Symbol.for('CheckMasterMiddleware'),
  CheckUserTypeSellerMiddleware: Symbol.for('CheckUserTypeSellerMiddleware'),

  Admin: {
    UserController: Symbol.for('AdminUserController'),
    ProductController: Symbol.for('AdminProductController'),
    ShopController: Symbol.for('AdminShopController'),
    StatisticController: Symbol.for('AdminStatisticController'),
    OrderController: Symbol.for('OrderController')
  }
};

export default TYPES;
