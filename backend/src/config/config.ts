export = {
  development: {
    url: 'postgresql://informa:ped2025*@energest-postgres-server.postgres.database.azure.com:5432/postgres',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    url: 'postgresql://informa:ped2025*@energest-postgres-server.postgres.database.azure.com:5432/postgres',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};