'use strict';

const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Carrega os dados do arquivo JSON
      const dataPath = path.join(__dirname, 'data', 'grupo_materiais.json');
      const grupo_materiais = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      // Insere os dados na tabela
      await queryInterface.bulkInsert({
        tableName: 'grupo_materiais',
        schema: 'internal'
      }, grupo_materiais, {});
      
      console.log(`✅ Inseridos ${grupo_materiais.length} grupos-materiais na tabela grupo_materiais`);
      
    } catch (error) {
      console.error('❌ Erro ao popular tabela grupo_materiais:', error.message);
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete({
      tableName: 'grupo_materiais',
      schema: 'internal'
    }, null, {});
    
    console.log('✅ Removidos todos os dados da tabela grupo_materiais');
  }
};
