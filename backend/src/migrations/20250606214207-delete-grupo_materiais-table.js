'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Deletar a tabela grupo_materiais do schema internal
    await queryInterface.dropTable({ tableName: 'grupo_materiais', schema: 'internal' });
  },

  async down (queryInterface, Sequelize) {
    // Recriar a tabela grupo_materiais caso seja necessário reverter
    await queryInterface.createTable(
      { tableName: 'grupo_materiais', schema: 'internal' },
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false
        },
        cod_item_material: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        cod_grupo: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        data_grupo: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        }
      }
    );
  }
};
