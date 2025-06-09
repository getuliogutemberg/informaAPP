'use strict';

const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Carrega os dados do arquivo JSON
      const dataPath = path.join(__dirname, 'data', 'cadastro_materiais.json');
      const materiais = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      // Insere os dados na tabela
      await queryInterface.bulkInsert({
        tableName: 'cadastro_materiais',
        schema: 'internal'
      }, materiais, {});
      
      console.log(`✅ Inseridos ${materiais.length} materiais na tabela cadastro_materiais`);
      
    } catch (error) {
      console.error('❌ Erro ao popular tabela cadastro_materiais:', error.message);
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete({
      tableName: 'cadastro_materiais',
      schema: 'internal'
    }, null, {});
    
    console.log('✅ Removidos todos os dados da tabela cadastro_materiais');
  }
};
