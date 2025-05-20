import { Sequelize } from 'sequelize';
import config from './config/database';

const env = (process.env.NODE_ENV || 'development') as 'development' | 'production';
const cfg = config[env];

// Cria a instância com base na config
const sequelize = new Sequelize(cfg.database, cfg.username, cfg.password, {
  host: cfg.host,
  dialect: cfg.dialect,
  logging: cfg.logging,
  dialectOptions: cfg.dialectOptions,
  pool: cfg.pool,
});

export default sequelize;