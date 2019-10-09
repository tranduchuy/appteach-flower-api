import dotenv from 'dotenv';
import fs from 'fs';
import { Sequelize } from 'sequelize';

// // const console = process['console'];
export const ENVIRONMENT = process.env.NODE_ENV;
export const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

if (ENVIRONMENT === 'test') {
  console.info('Using .test.env');
  dotenv.config({ path: '.test.env' });
} else {
  if (fs.existsSync('.env')) {
    console.info('Using .env file to supply config environment variables');
    dotenv.config({ path: '.env' });
  } else {
    console.info('Using .env.example file to supply config environment variables');
    dotenv.config({ path: '.env.example' });  // you can delete this after you create your own .env file!
  }
}

export const SESSION_SECRET = process.env['SESSION_SECRET'];
export const MONGODB_URI = prod ? process.env['MONGODB_URI'] : process.env['MONGODB_URI_LOCAL'];
export const GOOGLE_DISTANCE_MATRIX = process.env['GOOGLE_DISTANCE_MATRIX'];
export const GOOGLE_GEOCODING = process.env['GOOGLE_GEOCODING'];
export const FRONT_END_DOMAIN = process.env['FRONT_END_DOMAIN'];
export const SPEED_SMS_TOKEN = process.env['SPEED_SMS_TOKEN'];

export const TWILIO_ACCOUNT_SID = process.env['TWILIO_ACCOUNT_SID'];
export const TWILIO_AUTH_TOKEN = process.env['TWILIO_AUTH_TOKEN'];
export const TWILIO_NUMBER = process.env['TWILIO_NUMBER'];

if (!SESSION_SECRET) {
  console.error('No client secret. Set SESSION_SECRET environment variable.');
  process.exit(1);
}

if (!MONGODB_URI) {
  console.error('No mongo connection string. Set MONGODB_URI environment variable.');
  process.exit(1);
}

export const SENDGRID_API_KEY = process.env['SENDGRID_API_KEY'];

export const MYSQL_CONNECTION = new Sequelize(
  process.env['MYSQL_DATABASE'],
  process.env['MYSQL_USERNAME'],
  process.env['MYSQL_PASSWORD'],
  {
    host: process.env['MYSQL_HOST'],
    dialect: 'mysql'
  }
);
