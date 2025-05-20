"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createSchema('internal').catch(() => {
        // ignora se já existir
    });
    await queryInterface.createTable({ schema: 'internal', tableName: 'routes' }, {
        id: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true, // conforme model
            primaryKey: false, // não é PK
        },
        path: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        component: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        requiredRole: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
        },
        pageId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        reportId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        workspaceId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        icon: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        createdAt: {
            allowNull: false,
            type: sequelize_1.DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: sequelize_1.DataTypes.DATE,
        },
    });
}
async function down(queryInterface) {
    await queryInterface.dropTable({ schema: 'internal', tableName: 'routes' });
}
