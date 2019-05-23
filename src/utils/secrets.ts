import dotenv from 'dotenv';
import fs from 'fs';

// // const console = process['console'];

if (fs.existsSync('.env')) {
  console.info('Using .env file to supply config environment variables');
  dotenv.config({path: '.env'});
} else {
  console.info('Using .env.example file to supply config environment variables');
  dotenv.config({path: '.env.example'});  // you can delete this after you create your own .env file!
}
export const ENVIRONMENT = process.env.NODE_ENV;
export const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

export const SESSION_SECRET = process.env['SESSION_SECRET'];
export const MONGODB_URI = prod ? process.env['MONGODB_URI'] : process.env['MONGODB_URI_LOCAL'];
export const GOOGLE_DISTANCE_MATRIX = process.env['GOOGLE_DISTANCE_MATRIX'];
export const FRONT_END_DOMAIN = process.env['FRONT_END_DOMAIN'];

if (!SESSION_SECRET) {
  console.error('No client secret. Set SESSION_SECRET environment variable.');
  process.exit(1);
}

if (!MONGODB_URI) {
  console.error('No mongo connection string. Set MONGODB_URI environment variable.');
  process.exit(1);
}
