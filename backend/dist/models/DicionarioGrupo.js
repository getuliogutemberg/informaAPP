"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database")); // ajuste se necessário
// Definição do model
class DicionarioGrupo extends sequelize_1.Model {
}
DicionarioGrupo.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    cod_grupo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    desc_grupo: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: {
                args: [0, 100],
                msg: 'Descrição não pode exceder 100 caracteres'
            }
        }
    }
}, {
    sequelize: database_1.default,
    modelName: 'DicionarioGrupo',
    tableName: 'dicionario_grupos',
    schema: 'internal', // remova se não estiver usando schemas
    timestamps: false,
    indexes: [{ fields: ['cod_grupo'] }]
});
exports.default = DicionarioGrupo;
