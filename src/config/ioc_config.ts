import "reflect-metadata";

import { Container } from "inversify";
import { UserService } from "../services/user.service";

import {
  UserController,
} from "../controllers";

import TYPES from "../constant/types";
import TAG from "../constant/tags";

const container = new Container();

// Bind Controller
container.bind<UserController>(TYPES.UserController).to(UserController).whenTargetNamed(TAG.UserController);

// Bind Service
container.bind<UserService>(TYPES.UserService).to(UserService);

// Bind model

export default container;