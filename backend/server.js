require("dotenv").config({ path: '../.env' });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ConfidentialClientApplication } = require('@azure/msal-node');
const { stringify } = require("querystring");

const msalClient = new ConfidentialClientApplication({
  auth: {
    clientId: process.env.POWER_BI_CLIENT_ID,
    clientSecret: process.env.POWER_BI_CLIENT_SECRET,
    authority: "https://login.microsoftonline.com/80899d73-a5f2-4a53-b252-077af6003b36",
  },
});

const config = {
  workspaceId: process.env.POWER_BI_WORKSPACE_ID,
  reportId: "0a95eaa5-9435-47c8-b12d-10b4df2858c2",
  pageId: "d7d35c6daec9e7e50737",
};

mongoose.connect(process.env.MONGO_URI).then(() => console.log("Banco de dados conectado"))
.catch((err) => console.log("Erro ao conectar ao banco de dados:", err));



const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: String,
  RG: String,
  password: String,
  category: String,
  className: String,
  refreshToken: String,
  position: { type: [Number], default: [0, 0] },
  customIcon: { type: String, default:'https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Transparent.png' }, // <-- Adiciona o ícone personalizado do usuário
  createAt: { type: String, default: new Date},
  updateAt: { type: String, default: new Date},
  status: { type: String, default: ''},
  isActive: { type: Boolean, default: false },
}));

const Route = mongoose.model("Route", new mongoose.Schema({
  path: { type: String, required: true },
  component: { type: String, required: true },
  requiredRole: { type: [String], default: [] }, // Role de usuários que podem acessar
  pageId: { type: String, required: false } // Adiciona o pageId para Dashboards, se necessário
}));

const Configuration = mongoose.model("Configuration", new mongoose.Schema({
  notifications: { type: Boolean, default: true },
  allowRegister: { type: Boolean, default: false },
  allowRequireRegister: { type: Boolean, default: false },
  allowNewCategory: { type: Boolean, default: false },
  allowNewClassName: { type: Boolean, default: false },
  addSecretKey: { type: Boolean, default: false },
  addCategory: { type: Boolean, default: true },
  fontFamily: { type: String, default: "Arial" },
  pageTitle: { type: String, default: "Configurações" },
  themeMode: { type: String, enum: ["light", "dark"], default: "light" },
  primaryColor: { type: Number, default: 56 },
  secondaryColor: { type: Number, default: 180 },
  backgroundColor: { type: Number, default: 0 },
  textColor: { type: Number, default: 0 },
  pbiKeys: {
    clientId: { type: String, default: "b918d10b-19f4-44c3-a58e-36e311e734ce" },
    clientSecret: { type: String, default: "dmZ8Q~Nmgk-9wiaO2Wxe6qRc8TZI.MZ8ob3psaP5" },
    authority: { type: String, default: "https://login.microsoftonline.com/80899d73-a5f2-4a53-b252-077af6003b36" },
  },
}, { timestamps: true }));




async function getReportDetails(token) {
  const url = `https://api.powerbi.com/v1.0/myorg/groups/${config.workspaceId}/reports/${config.reportId}`;
  const headers = { Authorization: `Bearer ${token}` };
  
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Erro ao buscar relatório: ${response.statusText}`);
  }
  return response.json();
}

async function generateEmbedToken(token, datasetId) {
  const url = "https://api.powerbi.com/v1.0/myorg/GenerateToken";
  const body = JSON.stringify({
    reports: [{ id: config.reportId }],
    datasets: [{ id: datasetId }],
  });
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, { method: "POST", headers, body });

    const contentType = response.headers.get("content-type");
    let responseData;

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      throw new Error(
        `❌ ERRO ${response.status} - ${responseData.error?.code || "Desconhecido"}: ${responseData.error?.message || responseData}`
      );
    }

    return responseData;
  } catch (error) {
    console.error("Erro ao adquirir token:", error.message);
    return null; // Retorna `null` para evitar quebra no fluxo
  }
}
// Middleware para verificar se o token é válido antes de prosseguir
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

// Middleware para verificar token JWT
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Acesso negado!" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifique se sua chave secreta está correta
    req.user = decoded;  // Defina o usuário no request com os dados do token
    next();
  } catch (err) {
    res.status(400).json({ message: "Token inválido!", error: err.message });
  }
};

// Middleware para verificar categoria
const verifyCategory = (category) => (req, res, next) => {
  if (req.user.category !== category) {
    return res.status(403).json({ message: "Acesso negado! Permissão insuficiente." });
  }
  next();
};



const app = express();
app.use(express.json());
app.use(cors({
  credentials: true,
  allowedHeaders: '*', 
  methods: '*',
  origin: '*', // Insira o endereço do frontend aqui
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Responde manualmente às requisições OPTIONS
  }

  next();
});

// Rota de registro
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, category, className,status } = req.body;
    if (!name || !email || !password || !category || !className) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email já cadastrado!" });
    const newStatus = status === "cadastro" ? "" : "pedido de acesso"; 
    const isActive = status === "cadastro" ? true : false; 
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword, category, className, status: newStatus,isActive });
    await newUser.save();

    res.status(201).json({ message: `${status === "cadastro" ? 'Usuário registrado com sucesso!' : 'Registro solicitado' }` + (status === "cadastro" && " " + JSON.stringify(newUser)) });
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor!", error: err.message });
  }
});

// Rota de login
app.post("/login", async (req, res) => {
 
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email e senha são obrigatórios!" });
    }

    const user = await User.findOne({ email });
    
    if (!user) return res.status(400).json({ message: "Usuário não encontrado!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Senha incorreta!" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ message: "Login bem-sucedido!", accessToken, refreshToken, route:'/',user });
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor!", error: err.message });
  }
});


// Rota para renovar o token de acesso
app.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Token de atualização obrigatório!" });

    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(403).json({ message: "Refresh Token inválido!" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Refresh Token expirado!" });

      const newAccessToken = generateAccessToken(user);
      res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor!", error: err.message });
  }
});

// Logout - Remove o refreshToken do usuário
app.post("/logout", verifyToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
    res.json({ message: "Logout bem-sucedido!" });
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor!", error: err.message });
  }
});

// Rota protegida de exemplo
app.get("/me", verifyToken, async (req, res) => {
  try {
    // Busca o usuário pelo id que vem do token
    const user = await User.findById(req.user.id).select("-password");
   
    // Verifica se o usuário foi encontrado
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    // Retorna o usuário sem a senha
    res.json(user);
  } catch (err) {
    console.error(err); // Registra o erro no console para depuração

    // Resposta de erro com status 500
    res.status(500).json({
      message: "Erro no servidor!",
      error: err.message || "Erro desconhecido",
    });
  }
});

// Rota exclusiva para administradores
app.get("/admin", verifyToken, verifyCategory("admin"), (req, res) => {
  res.json({ message: "Acesso permitido ao administrador!" });
});

// Endpoint para pegar os residentes
app.get('/users', async (req, res) => {
  try {
    // Verifica se já existe algum usuário no banco de dados
    const existingUsers = await User.find();
    
    // Se não houver usuários no banco, cria-os
    if (existingUsers.length === 0) {
      const groups = ["A", "B", "C"]; // Exemplo de grupos
      const tags = ["1", "2", "3", "4"]; // Exemplo de tags

      const generatedUsers = generateUsers(groups, tags);
     

      // Insere os usuários no banco de dados
      for (const group in generatedUsers) {
        for (const user of generatedUsers[group]) {
          const newUser = new User(user);
          await newUser.save();
        }
      }

      console.log("Usuários criados com sucesso!");
    }

    // Retorna os usuários do banco de dados
    const usersFromDB = await User.find();
    res.status(200).json(usersFromDB);

  } catch (err) {
    console.error("Erro ao obter os usuários", err);
    res.status(500).send("Erro ao obter os usuários");
  }
});

// Criar um novo usuário
app.post("/users", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    const newUser = new User({ username, email, password:hashedPassword });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar usuário" });
  }
});

// Atualizar usuário
app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
});

// Excluir usuário
app.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Erro ao excluir usuário" });
  }
});

// Endpoint para obter as rotas
app.get("/routes", async (req, res) => {
  try {
    // Verifica se já existem rotas no banco
    const routes = await Route.find();

    // Se não houver rotas, cria as rotas padrão
    if (routes.length === 0) {
      const defaultRoutes = [
        // {
        //   path: "/indicadores",
        //   component: `<ProtectedRoute><DashPBI pageId="d7d35c6daec9e7e50737" /></ProtectedRoute>`,
        //   requiredRole: ["admin", "user"], // Exemplo de roles que podem acessar
        //   pageId: "d7d35c6daec9e7e50737"
        // },
        // {
        //   path: "/gestão",
        //   component: `<ProtectedRoute><DashPBI pageId="4582490ac83feb518640" /></ProtectedRoute>`,
        //   requiredRole: ["admin", "manager"], // Exemplo de roles que podem acessar
        //   pageId: "4582490ac83feb518640"
        // }
      ];

      // Insere as rotas padrão no banco de dados
      await Route.insertMany(defaultRoutes);
      routes = await Route.find();
      console.log("Rotas padrão inseridas com sucesso.");
      return res.status(200).json(routes); // Retorna as rotas padrão para o cliente
    }

    // Caso existam rotas, retorna elas para o cliente
    res.status(200).json(routes);
  } catch (err) {
    console.error("Erro ao buscar rotas:", err);
    res.status(500).json({ message: "Erro ao buscar rotas", error: err.message });
  }
});


app.get("/getPBIToken/:pageId", async (req, res) => {
  const pageId = req.params.pageId
  try {
    const response = await msalClient.acquireTokenByClientCredential({
      scopes: ["https://analysis.windows.net/powerbi/api/.default"],
    });
    
    if (!response || !response.accessToken) {
      throw new Error("Falha ao obter token de acesso");
    }


    
    const reportDetails = await getReportDetails(response.accessToken);
    const embedTokenResponse = await generateEmbedToken(response.accessToken, reportDetails.datasetId);
    
    res.status(200).json({
      accessToken: embedTokenResponse.token,
      embedUrl: reportDetails.embedUrl,
      expiry: embedTokenResponse.expiration,
      pageId: pageId,
    });
  } catch (error) {
    console.error("Erro ao adquirir token:", error);
    res.status(500).json({ error: "Falha ao adquirir token", details: error.message });
  }
});

app.get("/configuration", async (req, res) => {
  try {
    const config = await Configuration.findOne();
    if (config) {
      const { _id, createdAt, updatedAt, __v, ...filteredConfig } = config.toObject();
      return res.json(filteredConfig);
    } else {
      // Se não houver configuração, cria uma nova com os valores padrão
      const newConfig = new Configuration();
      await newConfig.save();
      const { _id, createdAt, updatedAt, __v, ...filteredNewConfig } = newConfig.toObject();
      return res.json(filteredNewConfig);
    }
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    res.status(500).json({ message: "Erro ao buscar configurações" });
  }
});

app.put("/configuration", async (req, res) => {
  try {
    const updatedConfig = await Configuration.findOneAndUpdate({}, req.body, { new: true });

    if (!updatedConfig) {
      return res.status(404).json({ message: "Configuração não encontrada" });
    }

    const { _id, createdAt, updatedAt, __v, ...filteredConfig } = updatedConfig.toObject();
    res.json(filteredConfig);
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error);
    res.status(500).json({ message: "Erro ao atualizar configurações" });
  }
});


const server = http.createServer(app);

server.listen(process.env.PORT || 5000, () => {
  console.log("Servidor rodando na porta", process.env.PORT || 5000);
});

// Socket.io
const io = new Server(server, { cors: { origin: "*" } });
try {
  io.on("connection", (socket) => {
  console.log("Usuário conectado:", socket.id);

  socket.on("updatePosition", async ({ userId, position }) => {
    console.log("Usuário moveu:", userId, position);
    await User.findByIdAndUpdate(userId, { position });
    const allUsersPositions = await User.find();
    const allPositions = await Position.find();

    // Broadcast para todos os usuários conectados
    io.emit("allPositions", [...allPositions, ...allUsersPositions]);
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado:", socket.id);
  });
})
} catch (err) {
  console.error("Erro ao inicializar o socket.io:", err);
}


