"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CadastroMaterial = void 0;
exports.initCadastroMaterial = initCadastroMaterial;
const sequelize_1 = require("sequelize");
// Modelo Sequelize
class CadastroMaterial extends sequelize_1.Model {
}
exports.CadastroMaterial = CadastroMaterial;
// Função para inicializar o modelo
function initCadastroMaterial(sequelize) {
    CadastroMaterial.init({
        cod_item_material: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        cod_itemmaterial_ext: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true
        },
        desc_material: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            validate: {
                len: {
                    args: [1, 200],
                    msg: 'Descrição não pode exceder 200 caracteres'
                }
            }
        },
        desc_numero_itemmaterial: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true
        },
        cod_unidade_medida: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
            set(value) {
                this.setDataValue('cod_unidade_medida', value.trim().toUpperCase());
            }
        },
        cod_classematerial: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false
        },
        cod_grupo: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'cadastro_materials',
        timestamps: false
    });
}
