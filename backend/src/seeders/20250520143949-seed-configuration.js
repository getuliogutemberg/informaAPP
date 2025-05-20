'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      { tableName: 'configurations', schema: 'internal' },
      [
        {
          id: uuidv4(),
          pbiKeys: JSON.stringify({
            notifications: true,
            allowRegister: false,
            allowRequireRegister: false,
            allowNewCategory: false,
            allowNewClassName: false,
            addSecretKey: false,
            addCategory: false,
            fontFamily: 'Arial',
            pageTitle: 'Configurações',
            themeMode: 'light',
            primaryColor: 254,
            secondaryColor: 152,
            backgroundColor: 206,
            textColor: 0,
          }),
          createdAt: new Date('2025-03-01T03:51:45.486Z'),
          updatedAt: new Date('2025-03-25T19:20:57.294Z'),
          // remove __v pois não existe no DB
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      { tableName: 'configurations', schema: 'internal' },
      {
        // usar id, não _id, e valor correto se quiser apagar só esse registro
        // ex: id: '67c284513ff35e1c47801576' ou apagar todos com alguma condição que funcione
      },
      {}
    );
  },
};
