import "reflect-metadata";

import { Container } from "inversify";

import { MongoDBClient } from "../utils/mongodb/client";

import {
  UserController,
} from "../controllers";

import TYPES from "../constant/types";
import TAG from "../constant/tags";

const container = new Container();

// Bind Controller
container.bind<UserController>(TYPES.UserController).to(UserController).whenTargetNamed(TAG.UserController);

// Bind Service

// Bind model
container.bind<MongoDBClient>(TYPES.MongoDBClient).to(MongoDBClient);

export default container;
