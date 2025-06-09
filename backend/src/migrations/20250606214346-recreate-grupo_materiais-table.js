'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Criar a tabela grupo_materiais no schema internal com base no modelo GrupoMaterial
    await queryInterface.createTable(
      { tableName: 'grupo_materiais', schema: 'internal' },
      {
        cod_item_material: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: {
            model: { tableName: 'cadastro_materiais', schema: 'internal' },
            key: 'cod_item_material'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        cod_grupo: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: { tableName: 'dicionario_grupos', schema: 'internal' },
            key: 'cod_grupo'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        data_grupo: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
          allowNull: true
        }
      }
    );

    // Adicionar índice na coluna cod_grupo
    await queryInterface.addIndex(
      { tableName: 'grupo_materiais', schema: 'internal' },
      ['cod_grupo'],
      {
        name: 'grupo_materiais_cod_grupo_idx'
      }
    );
  },

  async down (queryInterface, Sequelize) {
    // Remover a tabela grupo_materiais do schema internal
    await queryInterface.dropTable({ tableName: 'grupo_materiais', schema: 'internal' });
  }
};
