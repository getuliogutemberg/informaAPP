"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alert = void 0;
exports.initAlert = initAlert;
const sequelize_1 = require("sequelize");
// Modelo Sequelize
class Alert extends sequelize_1.Model {
}
exports.Alert = Alert;
// Função de inicialização do modelo
function initAlert(sequelize) {
    Alert.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        type: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'O tipo do alerta é obrigatório' }
            }
        },
        title: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'O título do alerta é obrigatório' },
                len: {
                    args: [1, 100],
                    msg: 'O título não pode ter mais que 100 caracteres'
                }
            }
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'A descrição do alerta é obrigatória' }
            }
        },
        color: {
            type: sequelize_1.DataTypes.STRING,
            defaultValue: '#ffffff',
            validate: {
                is: {
                    args: /^#([0-9a-f]{3}){1,2}$/i,
                    msg: 'Cor inválida'
                }
            }
        },
        icon: {
            type: sequelize_1.DataTypes.STRING,
            defaultValue: 'warning'
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'alerts',
        timestamps: true,
        paranoid: true // ativa soft delete usando deletedAt
    });
}
