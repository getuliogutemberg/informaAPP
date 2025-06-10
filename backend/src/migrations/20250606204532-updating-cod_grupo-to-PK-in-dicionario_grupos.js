'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Atualizar a tabela dicionario_grupos no schema internal
    // 1. Remover a constraint de Primary Key da coluna id
    await queryInterface.removeConstraint(
      { tableName: 'dicionario_grupos', schema: 'internal' },
      'dicionario_grupos_pkey'
    );

    // 2. Remover a coluna id
    await queryInterface.removeColumn(
      { tableName: 'dicionario_grupos', schema: 'internal' },
      'id'
    );

    // 3. Adicionar constraint de Primary Key na coluna cod_grupo
    await queryInterface.addConstraint(
      { tableName: 'dicionario_grupos', schema: 'internal' },
      {
        fields: ['cod_grupo'],
        type: 'primary key',
        name: 'dicionario_grupos_pkey'
      }
    );

    // 4. Adicionar constraint unique na coluna cod_grupo (se não existir)
    await queryInterface.addConstraint(
      { tableName: 'dicionario_grupos', schema: 'internal' },
      {
        fields: ['cod_grupo'],
        type: 'unique',
        name: 'dicionario_grupos_cod_grupo_unique'
      }
    );
  },

  async down (queryInterface, Sequelize) {
    // Reverter as alterações
    // 1. Remover a constraint unique de cod_grupo
    await queryInterface.removeConstraint(
      { tableName: 'dicionario_grupos', schema: 'internal' },
      'dicionario_grupos_cod_grupo_unique'
    );

    // 2. Remover a constraint de Primary Key
    await queryInterface.removeConstraint(
      { tableName: 'dicionario_grupos', schema: 'internal' },
      'dicionario_grupos_pkey'
    );

    // 3. Adicionar a coluna id de volta
    await queryInterface.addColumn(
      { tableName: 'dicionario_grupos', schema: 'internal' },
      'id',
      {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      }
    );

    // 4. Tornar a coluna id a Primary Key novamente
    await queryInterface.addConstraint(
      { tableName: 'dicionario_grupos', schema: 'internal' },
      {
        fields: ['id'],
        type: 'primary key',
        name: 'dicionario_grupos_pkey'
      }
    );
  }
};
