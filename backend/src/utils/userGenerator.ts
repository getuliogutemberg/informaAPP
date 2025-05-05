import { generateUserByIndex } from "../middleware/userMiddleware"; 

interface User {
    id: number;
    RG: string;
    [key: string]: any; // Permite outras propriedades do usuário
}

interface UserGroup {
    [groupName: string]: User[];
}

export const generateUsers = (groupNames: string[], tagNames: string[]): UserGroup => {
    const users: UserGroup = {};
    let id = 1;

    // Itera sobre os grupos
    for (const group of groupNames) {
        users[group] = [];

        // Itera sobre as tags para cada grupo
        for (const tag of tagNames) {
            const user = generateUserByIndex(id); // Gera o usuário com índice
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

export default {
    generateUsers
};