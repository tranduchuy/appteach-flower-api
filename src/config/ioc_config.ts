import 'reflect-metadata';

import { Container } from 'inversify';

import { UserController, } from '../controllers';
import TYPES from '../constant/types';
import TAG from '../constant/tags';
import { AdminProductController } from '../controllers/admin/AdminProductController';
import { AdminStatisticController } from '../controllers/admin/AdminStatisticController';
import { AdminUserController } from '../controllers/admin/AdminUserController';
import { AdminShopController } from '../controllers/admin/AdminShopController';
import { AttributeController } from '../controllers/AttributeController';
import { SearchController } from '../controllers/SearchController';
import { ShopController } from '../controllers/ShopController';
import { CheckAdminMiddleware } from '../middlewares/check-admin';
import { CheckMasterMiddleware } from '../middlewares/check-master';
import { CheckSellerMiddleware } from '../middlewares/check-seller';
import { SearchService } from '../services/search.service';
import { ShopService } from '../services/shop.service';
import { UserService } from '../services/user.service';
import { MailerService } from '../services/mailer.service';
import { CheckTokenMiddleware } from '../middlewares/check-token';
import { ProductController } from '../controllers/ProductController';
import { ProductService } from '../services/product.service';
import { ImageService } from '../services/image.service';
import { AddressController } from '../controllers/AddressController';
import { AddressService } from '../services/address.service';
import { GoogleDistanceMatrixService } from '../services/google-distance-matrix.service';

import { OrderController } from '../controllers/OrderController';
import { OrderItemController } from '../controllers/OrderItemController';

import { OrderService } from '../services/order.service';
import { OrderItemService } from '../services/order-item.service';
import { FacebookGraphApiService } from '../services/facebook-graph-api.service';
import { CostService } from '../services/cost.service';
import { ShopStatisticController } from '../controllers/ShopStatisticController';
import { NotifyController } from '../controllers/NotifyController';
import { NotifyService } from '../services/notify.service';
import { AdminOrderController } from '../controllers/admin/AdminOrderController';
import { ProductWorkerService } from '../services/product-worker.service';
import { GoogleGeocodingService } from '../services/google-geocoding.service';
import { OrderWorkerService } from '../services/order-worker.service';
import { SmsService } from '../services/sms.service';
import { NewController } from '../controllers/NewsController';
import { AdminNewController } from '../controllers/admin/AdminNewController';
import { NewService } from '../services/new.service';
import { SaleNotificationController } from '../controllers/SaleNotificationController';
import { SaleNotificationService } from '../services/sale-notification.service';
import { TagService } from '../services/tag.service';

const container = new Container();

// Bind Controller
container.bind<UserController>(TYPES.UserController).to(UserController).whenTargetNamed(TAG.UserController);
container.bind<ProductController>(TYPES.ProductController).to(ProductController).whenTargetNamed(TAG.ProductController);
container.bind<SearchController>(TYPES.SearchController).to(SearchController);
container.bind<OrderController>(TYPES.OrderController).to(OrderController);
container.bind<SearchController>(TYPES.SearchController).to(SearchController);
container.bind<AddressController>(TYPES.AddressController).to(AddressController);
container.bind<ShopController>(TYPES.ShopController).to(ShopController);
container.bind<OrderItemController>(TYPES.OrderItemController).to(OrderItemController);
container.bind<ShopStatisticController>(TYPES.ShopStatisticController).to(ShopStatisticController);
container.bind<NotifyController>(TYPES.NotifyController).to(NotifyController);
container.bind<NewController>(TYPES.NewController).to(NewController);
container.bind<SaleNotificationController>(TYPES.SaleNotification).to(SaleNotificationController);
container.bind<AttributeController>(TYPES.AttributeController).to(AttributeController);

// Bind Admin Controller
container.bind<AdminUserController>(TYPES.Admin.UserController).to(AdminUserController);
container.bind<AdminProductController>(TYPES.Admin.ProductController).to(AdminProductController);
container.bind<AdminShopController>(TYPES.Admin.ShopController).to(AdminShopController);
container.bind<AdminStatisticController>(TYPES.Admin.StatisticController).to(AdminStatisticController);
container.bind<AdminOrderController>(TYPES.Admin.OrderController).to(AdminOrderController);
container.bind<AdminNewController>(TYPES.Admin.NewController).to(AdminNewController);
// Bind Service
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<ProductService>(TYPES.ProductService).to(ProductService);
container.bind<MailerService>(TYPES.MailerService).to(MailerService);
container.bind<SearchService>(TYPES.SearchService).to(SearchService);
container.bind<ImageService>(TYPES.ImageService).to(ImageService);
container.bind<OrderService>(TYPES.OrderService).to(OrderService);
container.bind<OrderItemService>(TYPES.OrderItemService).to(OrderItemService);
container.bind<AddressService>(TYPES.AddressService).to(AddressService);
container.bind<ShopService>(TYPES.ShopService).to(ShopService);
container.bind<GoogleDistanceMatrixService>(TYPES.GoogleDistanceMatrixService).to(GoogleDistanceMatrixService);
container.bind<FacebookGraphApiService>(TYPES.FacebookGraphApiService).to(FacebookGraphApiService);
container.bind<CostService>(TYPES.CostService).to(CostService);
container.bind<NotifyService>(TYPES.NotifyService).to(NotifyService);
container.bind<ProductWorkerService>(TYPES.ProductWorkerService).to(ProductWorkerService);
container.bind<OrderWorkerService>(TYPES.OrderWorkerService).to(OrderWorkerService);
container.bind<GoogleGeocodingService>(TYPES.GoogleGeocodingService).to(GoogleGeocodingService);
container.bind<SmsService>(TYPES.SmsService).to(SmsService);
container.bind<NewService>(TYPES.NewService).to(NewService);
container.bind<SaleNotificationService>(TYPES.SaleNotificationService).to(SaleNotificationService);
container.bind<TagService>(TYPES.TagService).to(TagService);

// Bind model

// Bind Middleware
container.bind<CheckTokenMiddleware>(TYPES.CheckTokenMiddleware).to(CheckTokenMiddleware);
container.bind<CheckAdminMiddleware>(TYPES.CheckAdminMiddleware).to(CheckAdminMiddleware);
container.bind<CheckMasterMiddleware>(TYPES.CheckMasterMiddleware).to(CheckMasterMiddleware);
container.bind<CheckSellerMiddleware>(TYPES.CheckUserTypeSellerMiddleware).to(CheckSellerMiddleware);

export default container;
