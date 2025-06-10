'use strict';

const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Carrega os dados do arquivo JSON
      const dataPath = path.join(__dirname, 'data', 'estrategia_parametros.json');
      const parametros = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      // Insere os dados na tabela
      await queryInterface.bulkInsert({
        tableName: 'estrategia_parametros',
        schema: 'internal'
      }, parametros, {});
      
      console.log(`✅ Inseridos ${parametros.length} parâmetros na tabela estrategia_parametros`);
      
    } catch (error) {
      console.error('❌ Erro ao popular tabela estrategia_parametros:', error.message);
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete({
      tableName: 'estrategia_parametros',
      schema: 'internal'
    }, null, {});
    
    console.log('✅ Removidos todos os dados da tabela estrategia_parametros');
  }
};
