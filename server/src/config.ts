import 'dotenv/config';

export const config = {
  PWD: process.env.PWD,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,

  APP_BACKEND_PREFIX: process.env.APP_BACKEND_PREFIX,
  APP_CORS_WHITELIST_URLS: process.env.APP_CORS_WHITELIST_URLS,

  MONGODB_URL: process.env.MONGODB_URL,
};
