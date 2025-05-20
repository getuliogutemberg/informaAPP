"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserByIndex = void 0;
const names = ["Ana", "Carlos", "Fernanda", "Ricardo", "Juliana", "Marcos", "Larissa", "Daniel", "Beatriz", "Felipe"];
const surnames = ["Silva", "Santos", "Lima", "Alves", "Mendes", "Ferreira", "Gomes", "Rocha", "Pereira", "Castro"];
const emails = ["ana", "carlos", "fernanda", "ricardo", "juliana", "marcos", "larissa", "daniel", "beatriz", "felipe"];
const domains = ["@gmail.com", "@hotmail.com", "@outlook.com", "@yahoo.com"];
const categories = ["Cliente", "Funcionário", "Administrador"];
const classNames = ["CLIENT", "ADMIN"];
const icons = [
    "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
    "https://www.pngall.com/wp-content/uploads/2/Male-Avatar-PNG.png",
    "https://www.pngall.com/wp-content/uploads/2/Female-Avatar-PNG.png"
];
const statusOptions = [
    { status: "normal", color: 'rgb(7, 224, 11)' },
    { status: "alerta", color: 'rgb(196, 187, 0)' },
    { status: "alarme", color: 'rgb(235, 0, 0)' },
];
const generateUserByIndex = (index) => {
    const name = `${names[index % names.length]} ${surnames[index % surnames.length]}`;
    const email = `${emails[index % emails.length]}${domains[index % domains.length]}`;
    const category = categories[index % categories.length];
    const className = classNames[index % classNames.length];
    const position = [Math.random() * 10, Math.random() * 10];
    const customIcon = icons[index % icons.length];
    const { status, color } = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const isActive = Math.random() > 0.5;
    return {
        name,
        email,
        password: generatePassword(),
        category,
        className,
        position,
        customIcon,
        status,
        color,
        isActive,
        createAt: new Date(),
        updateAt: new Date(),
    };
};
exports.generateUserByIndex = generateUserByIndex;
const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
};
exports.default = {
    generateUserByIndex: exports.generateUserByIndex
};
