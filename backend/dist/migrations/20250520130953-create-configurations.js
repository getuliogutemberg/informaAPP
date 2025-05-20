"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable({ tableName: 'configurations', schema: 'internal' }, {
        id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
        },
        notifications: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        allowRegister: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        allowRequireRegister: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        allowNewCategory: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        allowNewClassName: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        addSecretKey: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        addCategory: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        fontFamily: {
            type: sequelize_1.DataTypes.STRING,
            defaultValue: 'Arial',
            allowNull: false,
        },
        pageTitle: {
            type: sequelize_1.DataTypes.STRING,
            defaultValue: 'Configurações',
            allowNull: false,
        },
        themeMode: {
            type: sequelize_1.DataTypes.ENUM('light', 'dark'),
            defaultValue: 'light',
            allowNull: false,
        },
        primaryColor: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 56,
            allowNull: false,
        },
        secondaryColor: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 180,
            allowNull: false,
        },
        backgroundColor: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        textColor: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        pbiKeys: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {
                clientId: 'b918d10b-19f4-44c3-a58e-36e311e734ce',
                clientSecret: 'dmZ8Q~Nmgk-9wiaO2Wxe6qRc8TZI.MZ8ob3psaP5',
                authority: 'https://login.microsoftonline.com/80899d73-a5f2-4a53-b252-077af6003b36',
            },
            allowNull: false,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    });
}
async function down(queryInterface) {
    await queryInterface.dropTable({ tableName: 'configurations', schema: 'internal' });
}
