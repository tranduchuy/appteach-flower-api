import "reflect-metadata";
import session from "express-session";
import { InversifyExpressServer } from "inversify-express-utils";
import { makeLoggerMiddleware } from "inversify-logger-middleware";
import * as bodyParser from "body-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import mongo from "connect-mongo";
import mongoose from "mongoose";
import bluebird from "bluebird";

import { MONGODB_URI, SESSION_SECRET } from "./utils/secrets";

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env.example" });

const MongoStore = mongo(session);

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
(<any>mongoose).Promise = bluebird;
mongoose.connect(mongoUrl, { useMongoClient: true }).then(
  () => {
    console.log("MongoDB connection successful");
  },
).catch(err => {
  console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
  // process.exit();
});

// load everything needed to the Container
import container from "./config/ioc_config";

if (process.env.NODE_ENV === "development") {
  const logger = makeLoggerMiddleware();
  container.applyMiddleware(logger);
}

// start the server
const server = new InversifyExpressServer(container);
const app = server.build();

app.set("port", process.env.PORT || 3000);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(helmet());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  store: new MongoStore({
    url: mongoUrl,
    autoReconnect: true
  })
}));

export default app;
