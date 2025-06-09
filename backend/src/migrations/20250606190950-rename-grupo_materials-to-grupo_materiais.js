'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Renomear a tabela de grupo_materials para grupo_materiais no schema internal
    await queryInterface.renameTable(
      { tableName: 'grupo_materials', schema: 'internal' }, 
      'grupo_materiais'
    );
  },

  async down (queryInterface, Sequelize) {
    // Reverter a alteração - renomear de volta para grupo_materials no schema internal
    await queryInterface.renameTable(
      { tableName: 'grupo_materiais', schema: 'internal' }, 
      'grupo_materials'
    );
  }
};
