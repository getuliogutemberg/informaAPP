import sequelize from '../database';
import { initCadastroMaterial } from './CadastroMaterial';
import { initClasseMaterial } from './ClasseMaterial';
import { initUnidadeMaterial } from './UnidadeMaterial';
import { initAlert } from './Alert';

// Inicializar todos os modelos que usam funções de inicialização
export function initializeModels() {
  initCadastroMaterial(sequelize);
  initClasseMaterial(sequelize);
  initUnidadeMaterial(sequelize);
  initAlert(sequelize);
}

// Exportar a instância do sequelize
export { sequelize };
