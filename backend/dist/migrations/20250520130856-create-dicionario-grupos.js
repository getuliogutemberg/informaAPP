"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable({ tableName: 'dicionario_grupos', schema: 'internal' }, {
        id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
        },
        cod_grupo: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        desc_grupo: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
    });
    await queryInterface.addIndex({ tableName: 'dicionario_grupos', schema: 'internal' }, {
        fields: ['cod_grupo'],
    });
}
async function down(queryInterface) {
    await queryInterface.dropTable({ tableName: 'dicionario_grupos', schema: 'internal' });
}
