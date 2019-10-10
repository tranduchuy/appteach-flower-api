import './models';
import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';

// const scribe = require('scribe-js')();
// const console = process['console'];

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: '.env.example' });

// load everything needed to the Container
import container from './config/ioc_config';

// start the server
const server = new InversifyExpressServer(container);
server.setConfig((app) => {
  app.use(cors());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(helmet());
  // app.use('/logs', scribe.webPanel());
});

const app = server.build();
app.set('port', 2000);

export default app;
