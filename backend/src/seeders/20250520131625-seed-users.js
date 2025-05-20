'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordCliente = await bcrypt.hash('123', 12);
    const passwordAdmin = await bcrypt.hash('123', 12);
    const passwordOwner = await bcrypt.hash('123', 12);

    await queryInterface.bulkInsert(
      { tableName: 'users', schema: 'internal'},
      [
        {
          id: uuidv4(),
          name: 'Cliente',
          email: 'cliente@energest.com.br',
          password: passwordCliente,
          category: 'ENERGEST',
          className: 'CLIENT',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Administrador',
          email: 'admin@energest.com.br',
          password: passwordAdmin,
          category: 'ENERGEST',
          className: 'ADMIN',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'INFORMA',
          email: 'owner@informa.com.br',
          password: passwordOwner,
          category: 'INFORMA',
          className: 'OWNER',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete({ tableName: 'Users', schema: 'internal' }, null, {});
  },
};
