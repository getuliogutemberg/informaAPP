'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Criar a tabela cadastro_materiais no schema internal
    await queryInterface.createTable(
      { tableName: 'cadastro_materiais', schema: 'internal' },
      {
        cod_item_material: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          unique: true
        },
        cod_itemmaterial_ext: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        desc_material: {
          type: Sequelize.STRING(1000),
          allowNull: false
        },
        desc_numero_itemmaterial: {
          type: Sequelize.STRING(1000),
          allowNull: true
        },
        cod_unidade_medida: {
          type: Sequelize.STRING(1000),
          allowNull: false,
          references: {
            model: { tableName: 'unidade_materiais', schema: 'internal' },
            key: 'cod_unidade'
          }
        },
        cod_classematerial: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: { tableName: 'classe_materiais', schema: 'internal' },
            key: 'cod_classematerial'
          }
        },
        cod_grupo: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: { tableName: 'dicionario_grupos', schema: 'internal' },
            key: 'cod_grupo'
          }
        }
      }
    );
  },

  async down (queryInterface, Sequelize) {
    // Remover a tabela cadastro_materiais do schema internal
    await queryInterface.dropTable({ tableName: 'cadastro_materiais', schema: 'internal' });
  }
};
