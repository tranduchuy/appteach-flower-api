import 'reflect-metadata';

import { Container } from 'inversify';

import { UserController, } from '../controllers';
import TYPES from '../constant/types';
import TAG from '../constant/tags';
import { AdminProductController } from '../controllers/admin/AdminProductController';
import { AdminUserController } from '../controllers/admin/AdminUserController';
import { SearchController } from '../controllers/SearchController';
import { CheckAdminMiddleware } from '../middlewares/check-admin';
import { CheckMasterMiddleware } from '../middlewares/check-master';
import { SearchService } from '../services/search.service';
import { ShopService } from '../services/shop.service';
import { UserService } from '../services/user.service';
import { MailerService } from '../services/mailer.service';
import { CheckTokenMiddleware } from '../middlewares/check-token';
import { ProductController } from '../controllers/ProductController';
import { ProductService } from '../services/product.service';
import { ImageService } from '../services/image.service';
import { AddressController } from "../controllers/AddressController";
import { AddressService } from "../services/address.service";

const container = new Container();

// Bind Controller
container.bind<UserController>(TYPES.UserController).to(UserController).whenTargetNamed(TAG.UserController);
container.bind<ProductController>(TYPES.ProductController).to(ProductController).whenTargetNamed(TAG.ProductController);
container.bind<SearchController>(TYPES.SearchController).to(SearchController);
container.bind<AddressController>(TYPES.AddressController).to(AddressController);

// Bind Admin Controller
container.bind<AdminUserController>(TYPES.Admin.UserController).to(AdminUserController);
container.bind<AdminProductController>(TYPES.Admin.ProductController).to(AdminProductController);

// Bind Service
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<ProductService>(TYPES.ProductService).to(ProductService);
container.bind<MailerService>(TYPES.MailerService).to(MailerService);
container.bind<SearchService>(TYPES.SearchService).to(SearchService);
container.bind<ImageService>(TYPES.ImageService).to(ImageService);
container.bind<AddressService>(TYPES.AddressService).to(AddressService);
container.bind<ShopService>(TYPES.ShopService).to(ShopService);

// Bind model

// Bind Middleware
container.bind<CheckTokenMiddleware>(TYPES.CheckTokenMiddleware).to(CheckTokenMiddleware);
container.bind<CheckAdminMiddleware>(TYPES.CheckAdminMiddleware).to(CheckAdminMiddleware);
container.bind<CheckMasterMiddleware>(TYPES.CheckMasterMiddleware).to(CheckMasterMiddleware);

export default container;