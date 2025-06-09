'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Criar a tabela classe_materiais no schema internal
    await queryInterface.createTable(
      { tableName: 'classe_materiais', schema: 'internal' },
      {
        cod_classematerial: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        desc_classematerial: {
          type: Sequelize.STRING(1000),
          allowNull: false
        }
      }
    );
  },

  async down (queryInterface, Sequelize) {
    // Remover a tabela classe_materiais do schema internal
    await queryInterface.dropTable({ tableName: 'classe_materiais', schema: 'internal' });
  }
};
