"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable({ tableName: 'estrategia_parametros', schema: 'internal' }, {
        id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
        },
        cod_grupo: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        cod_item_material: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        client: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: 'default',
        },
        cods_parametro: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
            allowNull: false,
        },
        cods_opcao: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
            allowNull: false,
        },
        data_estrategia: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    });
    // Índices
    await queryInterface.addIndex({ tableName: 'estrategia_parametros', schema: 'internal' }, {
        fields: ['cod_grupo'],
    });
    await queryInterface.addIndex({ tableName: 'estrategia_parametros', schema: 'internal' }, {
        fields: ['cod_item_material'],
    });
    await queryInterface.addIndex({ tableName: 'estrategia_parametros', schema: 'internal' }, {
        fields: ['data_estrategia'],
    });
}
async function down(queryInterface) {
    await queryInterface.dropTable({ tableName: 'estrategia_parametros', schema: 'internal' });
}
