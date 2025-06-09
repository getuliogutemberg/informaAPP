'use strict';

const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Carrega os dados do arquivo JSON
      const dataPath = path.join(__dirname, 'data', 'unidade_materiais.json');
      const unidades = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      // Insere os dados na tabela
      await queryInterface.bulkInsert({
        tableName: 'unidade_materiais',
        schema: 'internal'
      }, unidades, {});
      
      console.log(`✅ Inseridas ${unidades.length} unidades de medida na tabela unidade_materiais`);
      
    } catch (error) {
      console.error('❌ Erro ao popular tabela unidade_materiais:', error.message);
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete({
      tableName: 'unidade_materiais',
      schema: 'internal'
    }, null, {});
    
    console.log('✅ Removidos todos os dados da tabela unidade_materiais');
  }
};
