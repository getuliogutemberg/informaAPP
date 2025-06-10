'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Remove a coluna id da tabela estrategia_parametros
    await queryInterface.removeColumn({
      tableName: 'estrategia_parametros',
      schema: 'internal'
    }, 'id');
    
    console.log('✅ Coluna id removida da tabela estrategia_parametros');
  },

  async down (queryInterface, Sequelize) {
    // Recriar a coluna id caso seja necessário reverter
    await queryInterface.addColumn({
      tableName: 'estrategia_parametros',
      schema: 'internal'
    }, 'id', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
    });
    
    console.log('✅ Coluna id adicionada de volta à tabela estrategia_parametros');
  }
};
