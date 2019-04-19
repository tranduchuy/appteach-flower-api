import 'reflect-metadata';

import { Container } from 'inversify';

import {
  UserController,
} from '../controllers';

import TYPES from '../constant/types';
import TAG from '../constant/tags';
import { UserService } from '../services/user.service';
import {MailerService} from "../services/mailer.service";

import {CheckTokenMiddleware} from "../middlewares/check-token";

const container = new Container();

// Bind Controller
container.bind<UserController>(TYPES.UserController).to(UserController).whenTargetNamed(TAG.UserController);

// Bind Service
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<MailerService>(TYPES.MailerService).to(MailerService);
// Bind model

//Bind Middleware
container.bind<CheckTokenMiddleware>(TYPES.CheckTokenMiddleware).to(CheckTokenMiddleware);

export default container;