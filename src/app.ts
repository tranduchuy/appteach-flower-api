import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
// import { makeLoggerMiddleware } from 'inversify-logger-middleware';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import { MONGODB_URI } from './utils/secrets';

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({path: '.env.example'});

// Connect to MongoDB
mongoose.connect(MONGODB_URI, <any>{useNewUrlParser: true}, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log('Connect to mongodb cluster successfully');
  }
});

// load everything needed to the Container
import container from './config/ioc_config';

// if (process.env.NODE_ENV === 'development') {
//   const logger = makeLoggerMiddleware();
//   container.applyMiddleware(logger);
// }

// start the server
const server = new InversifyExpressServer(container);
server.setConfig((app) => {
  app.use(cors());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(helmet());
});

const app = server.build();
app.set('port', process.env.PORT || 2000);

export default app;
