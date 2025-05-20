import { Dialect } from 'sequelize';

interface DBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
  logging: boolean;
  dialectOptions: {
    ssl: {
      require: boolean;
      rejectUnauthorized: boolean;
    };
  };
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}

const development: DBConfig = {
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

export default {
  development,
  production,
};
