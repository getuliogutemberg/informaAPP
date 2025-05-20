"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUsers = void 0;
const userMiddleware_1 = require("../middleware/userMiddleware");
const generateUsers = (groupNames, tagNames) => {
    const users = {};
    let id = 1;
    // Itera sobre os grupos
    for (const group of groupNames) {
        users[group] = [];
        // Itera sobre as tags para cada grupo
        for (const tag of tagNames) {
            const user = (0, userMiddleware_1.generateUserByIndex)(id); // Gera o usuário com índice
            users[group].push({
                ...user,
                id,
                RG: `${group}${tag}`
            });
            id++;
        }
        users[group].reverse(); // Para ordenar de cima para baixo
    }
    return users;
};
exports.generateUsers = generateUsers;
exports.default = {
    generateUsers: exports.generateUsers
};
