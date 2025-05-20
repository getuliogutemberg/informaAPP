"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createSchema('internal').catch(() => {
        // ignora se já existir
    });
    await queryInterface.createTable({ schema: 'internal', tableName: 'grupo_materials' }, {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        cod_item_material: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        cod_grupo: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        data_grupo: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    });
    // Índices
    await queryInterface.addIndex({ schema: 'internal', tableName: 'grupo_materials' }, ['cod_item_material']);
    await queryInterface.addIndex({ schema: 'internal', tableName: 'grupo_materials' }, ['cod_grupo']);
}
async function down(queryInterface) {
    await queryInterface.dropTable({ schema: 'internal', tableName: 'grupo_materials' });
}
