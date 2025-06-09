'use strict';

const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Carrega os dados do arquivo JSON
      const dataPath = path.join(__dirname, 'data', 'dicionario_grupos.json');
      const grupos = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      // Insere os dados na tabela
      await queryInterface.bulkInsert({
        tableName: 'dicionario_grupos',
        schema: 'internal'
      }, grupos, {});
      
      console.log(`✅ Inseridos ${grupos.length} grupos na tabela dicionario_grupos`);
      
    } catch (error) {
      console.error('❌ Erro ao popular tabela dicionario_grupos:', error.message);
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete({
      tableName: 'dicionario_grupos',
      schema: 'internal'
    }, null, {});
    
    console.log('✅ Removidos todos os dados da tabela dicionario_grupos');
  }
};