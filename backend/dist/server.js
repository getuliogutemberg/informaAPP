"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_1 = __importDefault(require("./socket"));
const sequelize_1 = require("sequelize");
// Import controllers
const authController_1 = __importDefault(require("./controllers/authController"));
const userController_1 = __importDefault(require("./controllers/userController"));
const routeController_1 = __importDefault(require("./controllers/routeController"));
const pbiController_1 = __importDefault(require("./controllers/pbiController"));
const configurationController_1 = __importDefault(require("./controllers/configurationController"));
const alertController_1 = __importDefault(require("./controllers/alertController"));
const groupDictionaryController_1 = __importDefault(require("./controllers/groupDictionaryController"));
const materialsController_1 = __importDefault(require("./controllers/materialsController"));
const paramsController_1 = __importDefault(require("./controllers/paramsController"));
// Import middlewares
const authVerifier_1 = require("./middleware/authVerifier");
// Load environment variables
dotenv_1.default.config({ path: '../../.env' });
const sequelize = new sequelize_1.Sequelize(process.env.DATABASE_URL || "https://informa-app.vercel.app", {
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
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
// CORS configuration
app.use((0, cors_1.default)({
    credentials: true,
    allowedHeaders: '*',
    methods: '*',
    origin: '*',
}));
// Custom CORS middleware
app.use((req, res, next) => {
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
app.use(express_1.default.static('./public'));
// Auth routes
app.post("/register", authController_1.default.register);
app.post("/login", authController_1.default.login);
app.post("/refresh", authController_1.default.refresh);
app.post("/logout", authVerifier_1.verifyToken, authController_1.default.logout);
app.get("/me", authVerifier_1.verifyToken, authController_1.default.me);
app.get("/admin", authVerifier_1.verifyToken, (0, authVerifier_1.verifyCategory)("admin"), authController_1.default.admin);
// User routes
app.get('/users', userController_1.default.getUsers);
app.post("/users", userController_1.default.createUser);
app.put("/users/:id", userController_1.default.updateUser);
app.put("/users/:id/password", userController_1.default.updatePassword);
app.delete("/users/:id", userController_1.default.deleteUser);
// Route configuration routes
app.get("/routes", routeController_1.default.getRoutes);
app.post("/routes", routeController_1.default.createRoute);
app.put("/routes/:id", routeController_1.default.updateRoute);
app.delete("/routes/:id", routeController_1.default.deleteRoute);
// PBI routes
app.get("/getPBIToken/:pageId/:reportId/:workspaceId", pbiController_1.default.getPBIToken);
// Configuration routes
app.get("/configuration", configurationController_1.default.getConfiguration);
app.put("/configuration", configurationController_1.default.updateConfiguration);
// Alert routes
app.get('/alerts', alertController_1.default.getAllAlerts);
app.post('/alerts', alertController_1.default.createAlert);
app.put('/alerts/:id', alertController_1.default.updateAlert);
app.delete('/alerts/:id', alertController_1.default.deleteAlert);
// Group dictionary routes
app.get('/groupDictionary', groupDictionaryController_1.default.getGroupDictionaries);
// Material routes
app.get('/materials/:cod_grupo', materialsController_1.default.getMaterialByGroup);
// Strategic parameters routes
app.get('/params/group/:groupId', paramsController_1.default.getGroupParams);
app.get('/params/material/:materialId', paramsController_1.default.getMaterialParams);
app.put('/params/group/:groupId', paramsController_1.default.updateGroupParams);
app.put('/params/material/:materialId', paramsController_1.default.updateMaterialParams);
app.put('/params/reset/group/:groupId', paramsController_1.default.resetGroupItems);
app.put('/params/reset/material/:materialId', paramsController_1.default.resetItem);
// Create HTTP server
const server = http_1.default.createServer(app);
// Start server
const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log("Servidor rodando na porta", port);
});
// Initialize Socket.IO
(0, socket_1.default)(server);
