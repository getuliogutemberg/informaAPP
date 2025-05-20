import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import http from "http";
import initializeSocket from "./socket";
import { Sequelize, where, Op, DataTypes } from "sequelize";
// Import controllers
import AuthController from "./controllers/authController";
import UserController from "./controllers/userController";
import RouteController from "./controllers/routeController";
import PBIController from "./controllers/pbiController";
import ConfigurationController from "./controllers/configurationController";
import AlertController from "./controllers/alertController";
import GroupDictionaryController from "./controllers/groupDictionaryController";
import MaterialController from "./controllers/materialsController";
import ParamsController from "./controllers/paramsController";

// Import middlewares
import { verifyToken, verifyCategory } from "./middleware/authVerifier";

// Load environment variables

dotenv.config({ path: '../../.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL || "https://informa-app.vercel.app", {
  dialect: 'postgres',
  logging: false, // set to console.log to see SQL queries
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});
sequelize.authenticate()
  .then(() => console.log("Banco de dados conectado"))
  .catch((err) => console.log("Erro ao conectar ao banco de dados:", err));

// // Database connection
// mongoose.connect(process.env.MONGO_URI || '')
//   .then(() => console.log("Banco de dados conectado"))
//   .catch((err: Error) => console.log("Erro ao conectar ao banco de dados:", err));

// Initialize express app
const app = express();

// Middleware
app.use(express.json());

// CORS configuration
app.use(cors({
  credentials: true,
  allowedHeaders: '*',
  methods: '*',
  origin: '*', 
}));

// Custom CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Serve static frontend files
app.use(express.static('./public'));

// Auth routes
app.post("/register", AuthController.register);
app.post("/login", AuthController.login);
app.post("/refresh", AuthController.refresh);
app.post("/logout", verifyToken, AuthController.logout);
app.get("/me", verifyToken, AuthController.me);
app.get("/admin", verifyToken, verifyCategory("admin"), AuthController.admin);

// User routes
app.get('/users', UserController.getUsers);
app.post("/users", UserController.createUser);
app.put("/users/:id", UserController.updateUser);
app.put("/users/:id/password", UserController.updatePassword);
app.delete("/users/:id", UserController.deleteUser);

// Route configuration routes
app.get("/routes", RouteController.getRoutes);
app.post("/routes", RouteController.createRoute);
app.put("/routes/:id", RouteController.updateRoute);
app.delete("/routes/:id", RouteController.deleteRoute);

// PBI routes
app.get("/getPBIToken/:pageId/:reportId/:workspaceId", PBIController.getPBIToken);

// Configuration routes
app.get("/configuration", ConfigurationController.getConfiguration);
app.put("/configuration", ConfigurationController.updateConfiguration);

// Alert routes
app.get('/alerts', AlertController.getAllAlerts);
app.post('/alerts', AlertController.createAlert);
app.put('/alerts/:id', AlertController.updateAlert);
app.delete('/alerts/:id', AlertController.deleteAlert);

// Group dictionary routes
app.get('/groupDictionary', GroupDictionaryController.getGroupDictionaries);

// Material routes
app.get('/materials/:cod_grupo', MaterialController.getMaterialByGroup);

// Strategic parameters routes
app.get('/params/group/:groupId', ParamsController.getGroupParams);
app.get('/params/material/:materialId', ParamsController.getMaterialParams);
app.put('/params/group/:groupId', ParamsController.updateGroupParams);
app.put('/params/material/:materialId', ParamsController.updateMaterialParams);
app.put('/params/reset/group/:groupId', ParamsController.resetGroupItems);
app.put('/params/reset/material/:materialId', ParamsController.resetItem);

// Create HTTP server
const server = http.createServer(app);

// Start server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log("Servidor rodando na porta", port);
});

// Initialize Socket.IO
initializeSocket(server);