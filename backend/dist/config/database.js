"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const development = {
    username: 'informa',
    password: 'ped2025*',
    database: 'postgres',
    host: 'energest-postgres-server.postgres.database.azure.com',
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
const production = { ...development };
exports.default = {
    development,
    production,
};
