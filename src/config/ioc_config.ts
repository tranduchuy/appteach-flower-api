import 'reflect-metadata';

import { Container } from 'inversify';

import {
  UserController,
} from '../controllers';

import TYPES from '../constant/types';
import TAG from '../constant/tags';
import { SearchController } from '../controllers/SearchController';
import { UserService } from '../services/user.service';
import {MailerService} from "../services/mailer.service";

import {CheckTokenMiddleware} from "../middlewares/check-token";
import {ProductController} from "../controllers/ProductController";
import {ProductService} from "../services/product.service";

const container = new Container();

// Bind Controller
container.bind<UserController>(TYPES.UserController).to(UserController).whenTargetNamed(TAG.UserController);
container.bind<ProductController>(TYPES.ProductController).to(ProductController).whenTargetNamed(TAG.ProductController);
container.bind<SearchController>(TYPES.SearchController).to(SearchController);

// Bind Service
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<ProductService>(TYPES.ProductService).to(ProductService);
container.bind<MailerService>(TYPES.MailerService).to(MailerService);
// Bind model

// Bind Middleware
container.bind<CheckTokenMiddleware>(TYPES.CheckTokenMiddleware).to(CheckTokenMiddleware);

export default container;