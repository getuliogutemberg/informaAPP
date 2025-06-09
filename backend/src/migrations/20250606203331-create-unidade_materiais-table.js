'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Criar a tabela unidade_materiais no schema internal
    await queryInterface.createTable(
      { tableName: 'unidade_materiais', schema: 'internal' },
      {
        cod_unidade: {
          type: Sequelize.STRING(100),
          allowNull: false,
          primaryKey: true
        },
        desc_unidade: {
          type: Sequelize.STRING(100),
          allowNull: false
        }
      }
    );
  },

  async down (queryInterface, Sequelize) {
    // Remover a tabela unidade_materiais do schema internal
    await queryInterface.dropTable({ tableName: 'unidade_materiais', schema: 'internal' });
  }
};
