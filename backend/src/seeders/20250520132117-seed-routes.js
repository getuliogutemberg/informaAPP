'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert({ tableName: 'routes', schema: 'internal' }, [
      {
        id: uuidv4(),
        path: '/indicadores',
        component: 'Dashboard Power BI',
        name: 'Indicadores',
        requiredRole: ['ADMIN', 'CLIENT', 'OWNER'],
        pageId: '4582490ac83feb518640',
        reportId: '0a95eaa5-9435-47c8-b12d-10b4df2858c2',
        workspaceId: '232fac9b-09d0-4dd4-a903-c027d83a9d33',
        icon: 'dashboard',
        createdAt: new Date(),
        updatedAt: new Date('2025-04-11T22:22:34.842Z')
      },
      {
        id: uuidv4(),
        path: '/gestão',
        component: 'Dashboard Power BI',
        name: 'Gestão',
        requiredRole: ['ADMIN', 'CLIENT', 'OWNER'],
        pageId: '327bcaa1442966c08a47',
        reportId: '0a95eaa5-9435-47c8-b12d-10b4df2858c2',
        workspaceId: '232fac9b-09d0-4dd4-a903-c027d83a9d33',
        icon: 'dashboard',
        createdAt: new Date(),
        updatedAt: new Date('2025-05-05T13:29:01.104Z')
      },
      {
        id: uuidv4(),
        path: '/Configuração-de-Itens-Estratégicos-do-Estoque',
        component: 'Gestão de Grupos e Materiais',
        name: 'Configurações',
        requiredRole: ['ADMIN', 'CLIENT', 'OWNER'],
        pageId: '',
        reportId: '',
        workspaceId: '',
        icon: 'settings',
        createdAt: new Date(),
        updatedAt: new Date('2025-04-16T13:20:20.489Z')
      },
      {
        id: uuidv4(),
        path: '/diagnóstico-de-estoque',
        component: 'Dashboard Power BI',
        name: 'Diagnóstico',
        requiredRole: ['ADMIN', 'CLIENT', 'OWNER'],
        pageId: 'b06345ed42259c8ae969',
        reportId: '0a95eaa5-9435-47c8-b12d-10b4df2858c2',
        workspaceId: '232fac9b-09d0-4dd4-a903-c027d83a9d33',
        icon: 'dashboard',
        createdAt: new Date('2025-05-05T12:40:10.151Z'),
        updatedAt: new Date('2025-05-05T13:27:14.815Z')
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete({ tableName: 'Routes', schema: 'internal' }, null, {});
  }
};
