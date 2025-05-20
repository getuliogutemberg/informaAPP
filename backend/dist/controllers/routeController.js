"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const Route_1 = __importDefault(require("../models/Route"));
class RouteController {
    constructor() {
        this.getRoutes = async (req, res) => {
            try {
                // Verifica se já existem rotas no banco
                let routes = await Route_1.default.findAll();
                // Se não houver rotas, cria as rotas padrão
                if (routes.length === 0) {
                    const defaultRoutes = [
                        // Exemplo de rota
                        {
                            id: '01',
                            path: '/dashboard',
                            component: 'Dashboard',
                            name: 'Dashboard',
                            requiredRole: ['admin', 'user'],
                            icon: 'DashboardIcon',
                        },
                        // Adicione mais aqui se quiser
                    ];
                    if (defaultRoutes.length > 0) {
                        await Route_1.default.bulkCreate(defaultRoutes);
                        routes = await Route_1.default.findAll();
                        console.log("Rotas padrão inseridas com sucesso.");
                    }
                    res.status(200).json(routes);
                    return;
                }
                res.status(200).json(routes);
            }
            catch (err) {
                console.error("Erro ao buscar rotas:", err);
                res.status(500).json({ message: "Erro ao buscar rotas", error: err.message });
            }
        };
        this.createRoute = async (req, res) => {
            try {
                const { id, path, component, requiredRole, pageId, reportId, icon, name, workspaceId } = req.body;
                // Validações básicas
                if (!path || !component) {
                    res.status(400).json({
                        message: "Path e component são campos obrigatórios"
                    });
                    return;
                }
                // Verifica se já existe uma rota com o mesmo path
                const existingRoute = await Route_1.default.findOne({ where: { path } });
                if (existingRoute) {
                    res.status(400).json({
                        message: "Já existe uma rota com este path"
                    });
                    return;
                }
                // Cria e salva a nova rota no banco de dados
                const savedRoute = await Route_1.default.create({
                    id,
                    path,
                    component,
                    requiredRole: requiredRole || [],
                    pageId: pageId || "",
                    name: name || "",
                    reportId: reportId || "",
                    workspaceId: workspaceId || "",
                    icon: icon || ""
                });
                res.status(201).json(savedRoute);
            }
            catch (err) {
                console.error("Erro ao criar rota:", err);
                res.status(500).json({
                    message: "Erro ao criar rota",
                    error: err.message
                });
            }
        };
        this.updateRoute = async (req, res) => {
            try {
                const { path, component, requiredRole, pageId, reportId, workspaceId, icon, name } = req.body;
                const routeId = req.params.id;
                // Validações básicas
                if (!path || !component) {
                    res.status(400).json({
                        message: "Path e component são campos obrigatórios"
                    });
                    return;
                }
                // Verifica se já existe outra rota com o mesmo path (exceto a que está sendo editada)
                const existingRoute = await Route_1.default.findOne({
                    where: {
                        path,
                        id: { [sequelize_1.Op.ne]: routeId }
                    }
                });
                if (existingRoute) {
                    res.status(400).json({
                        message: "Já existe outra rota com este path"
                    });
                    return;
                }
                // Atualiza a rota
                const [affectedRows] = await Route_1.default.update({
                    path,
                    component,
                    name,
                    requiredRole: requiredRole || [],
                    pageId: pageId || "",
                    reportId: reportId || "",
                    workspaceId: workspaceId || "",
                    icon: icon || ""
                }, {
                    where: { id: routeId },
                    returning: true
                });
                if (affectedRows === 0) {
                    res.status(404).json({
                        message: "Rota não encontrada"
                    });
                    return;
                }
                const updatedRoute = await Route_1.default.findByPk(routeId);
                res.json(updatedRoute);
            }
            catch (err) {
                console.error("Erro ao atualizar rota:", err);
                res.status(500).json({
                    message: "Erro ao atualizar rota",
                    error: err.message
                });
            }
        };
        this.deleteRoute = async (req, res) => {
            try {
                const routeId = req.params.id;
                const deletedRoute = await Route_1.default.findByPk(routeId);
                if (!deletedRoute) {
                    res.status(404).json({
                        message: "Rota não encontrada"
                    });
                    return;
                }
                await deletedRoute.destroy();
                res.json({
                    message: "Rota excluída com sucesso",
                    route: deletedRoute
                });
            }
            catch (err) {
                console.error("Erro ao excluir rota:", err);
                res.status(500).json({
                    message: "Erro ao excluir rota",
                    error: err.message
                });
            }
        };
    }
    ;
}
exports.default = new RouteController();
