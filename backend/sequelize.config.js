require('ts-node/register');

const dbConfig = require('./src/config/database.ts').default;

module.exports = {
  development: {
    username: dbConfig.development.username,
    password: dbConfig.development.password,
    database: dbConfig.development.database,
    host: dbConfig.development.host,
    dialect: dbConfig.development.dialect,
    dialectOptions: dbConfig.development.dialectOptions,
  },
  production: {
    username: dbConfig.production.username,
    password: dbConfig.production.password,
    database: dbConfig.production.database,
    host: dbConfig.production.host,
    dialect: dbConfig.production.dialect,
    dialectOptions: dbConfig.production.dialectOptions,
  }
};
