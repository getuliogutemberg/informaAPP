"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable('cadastro_materials', {
        cod_item_material: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            unique: true,
        },
        cod_itemmaterial_ext: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        desc_material: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
        },
        desc_numero_itemmaterial: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        cod_unidade_medida: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
        },
        cod_classematerial: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        cod_grupo: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
    });
}
async function down(queryInterface) {
    await queryInterface.dropTable('cadastro_materials');
}
