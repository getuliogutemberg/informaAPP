"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database")); // ajuste o caminho conforme necessário
// Model Sequelize
class GrupoMaterial extends sequelize_1.Model {
}
GrupoMaterial.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    cod_item_material: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    cod_grupo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    data_grupo: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    sequelize: database_1.default,
    modelName: 'GrupoMaterial',
    tableName: 'grupo_materials',
    schema: 'internal', // remova se não usar schemas
    timestamps: false,
    indexes: [
        { fields: ['cod_item_material'] },
        { fields: ['cod_grupo'] }
    ]
});
exports.default = GrupoMaterial;
