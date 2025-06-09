'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Remove a coluna cod_grupo da tabela cadastro_materiais
    await queryInterface.removeColumn({
      tableName: 'cadastro_materiais',
      schema: 'internal'
    }, 'cod_grupo');
    
    console.log('✅ Coluna cod_grupo removida da tabela cadastro_materiais');
  },

  async down (queryInterface, Sequelize) {
    // Recriar a coluna cod_grupo caso seja necessário reverter
    await queryInterface.addColumn({
      tableName: 'cadastro_materiais',
      schema: 'internal'
    }, 'cod_grupo', {
      type: Sequelize.STRING(100),
      allowNull: true,
      references: {
        model: {
          tableName: 'grupo_materiais',
          schema: 'internal'
        },
        key: 'cod_item_material'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    
    console.log('✅ Coluna cod_grupo adicionada de volta à tabela cadastro_materiais');
  }
};
