'use strict';

const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Carrega os dados do arquivo JSON
      const dataPath = path.join(__dirname, 'data', 'classe_materiais.json');
      const classes = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      // Insere os dados na tabela
      await queryInterface.bulkInsert({
        tableName: 'classe_materiais',
        schema: 'internal'
      }, classes, {});
      
      console.log(`✅ Inseridas ${classes.length} classes na tabela classe_materiais`);
      
    } catch (error) {
      console.error('❌ Erro ao popular tabela classe_materiais:', error.message);
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete({
      tableName: 'classe_materiais',
      schema: 'internal'
    }, null, {});
    
    console.log('✅ Removidos todos os dados da tabela classe_materiais');
  }
};
