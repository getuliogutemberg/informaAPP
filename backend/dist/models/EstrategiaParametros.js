"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database")); // ajuste o caminho se necessário
// Definição do model
class EstrategiaParametros extends sequelize_1.Model {
}
EstrategiaParametros.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
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
        validate: {
            notEmpty: {
                msg: 'Deve haver pelo menos um código de parâmetro',
            },
        },
    },
    cods_opcao: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
        allowNull: false,
        validate: {
            isLengthMatch(value) {
                if (!Array.isArray(this.cods_parametro) ||
                    value.length !== this.cods_parametro.length) {
                    throw new Error('Deve ter o mesmo número de códigos de opção que de parâmetros');
                }
            },
        },
    },
    data_estrategia: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.default,
    modelName: 'EstrategiaParametros',
    tableName: 'estrategia_parametros',
    schema: 'internal', // remova se não estiver usando schemas
    timestamps: false,
    indexes: [
        { fields: ['cod_grupo'] },
        { fields: ['cod_item_material'] },
        { fields: ['data_estrategia'] },
    ],
});
exports.default = EstrategiaParametros;
