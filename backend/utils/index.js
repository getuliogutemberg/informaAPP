
const jwt = require("jsonwebtoken");

const generateUserByIndex = (index) => {
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
      password: generatePassword(), // Função para gerar uma senha segura
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
  
  // Função para gerar uma senha segura (você pode customizar conforme necessidade)
  const generatePassword = () => {
    return Math.random().toString(36).slice(-8); // Senha aleatória de 8 caracteres
  };
  
  const generateUsers = (groupNames, tagNames) => {
    const users = {};
    let id = 1;
  
    // Itera sobre os grupos
    for (const group of groupNames) {
      users[group] = [];
  
      // Itera sobre as tags para cada grupo
      for (const tag of tagNames) {
        const user = generateUserByIndex(id); // Gera o usuário com índice
        users[group].push({ ...user, id, RG: `${group}${tag}` }); // Adiciona RG e id único
        id++;
      }
      users[group].reverse(); // Para ordenar de cima para baixo
    }
  
    return users;
  };
  
  
  // Função para gerar tokens
  const generateAccessToken = (user) => {
    return jwt.sign(
      { id: user._id, category: user.category, className: user.className },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
  };
  
  const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
  };

  // Exports
  module.exports = {
    generateUserByIndex,
    generatePassword,
    generateUsers,
    generateAccessToken,
    generateRefreshToken,
  };