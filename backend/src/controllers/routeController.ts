import { Request, Response } from 'express';
import Route, { IRoute } from '../models/Route';

interface RouteRequestBody {
    path: string;
    component: string;
    requiredRole?: string[];
    pageId?: string;
    reportId?: string;
    workspaceId?: string;
    icon?: string;
    name?: string;
}

class RouteController {
    getRoutes = async (req: Request, res: Response): Promise<Response> => {
        try {
            let routes = await Route.find();

            if (routes.length === 0) {
                const defaultRoutes: IRoute[] = [
                    // {
                    //   path: "/indicadores",
                    //   component: `<ProtectedRoute><DashPBI pageId="d7d35c6daec9e7e50737" /></ProtectedRoute>`,
                    //   requiredRole: ["admin", "user"],
                    //   pageId: "d7d35c6daec9e7e50737"
                    // },
                ];

                await Route.insertMany(defaultRoutes);
                routes = await Route.find();
                console.log("Rotas padrão inseridas com sucesso.");
            }

            return res.status(200).json(routes);
        } catch (err: unknown) {
            const error = err as Error;
            console.error("Erro ao buscar rotas:", error);
            return res.status(500).json({ 
                message: "Erro ao buscar rotas", 
                error: error.message 
            });
        }
    };

    createRoute = async (req: Request<{}, {}, RouteRequestBody>, res: Response): Promise<Response> => {
        try {
            const { path, component, requiredRole, pageId, reportId, icon, name, workspaceId } = req.body;

            if (!path || !component) {
                return res.status(400).json({ 
                    message: "Path e component são campos obrigatórios" 
                });
            }

            const existingRoute = await Route.findOne({ path });
            if (existingRoute) {
                return res.status(400).json({ 
                    message: "Já existe uma rota com este path" 
                });
            }

            const newRoute = new Route({
                path,
                component,
                requiredRole: requiredRole || [],
                pageId: pageId || "",
                name: name || "",
                reportId: reportId || "",
                workspaceId: workspaceId || "",
                icon: icon || "",
            });

            const savedRoute = await newRoute.save();
            return res.status(201).json(savedRoute);
        } catch (err: unknown) {
            const error = err as Error;
            console.error("Erro ao criar rota:", error);
            return res.status(500).json({ 
                message: "Erro ao criar rota", 
                error: error.message 
            });
        }
    };

    updateRoute = async (req: Request<{ id: string }, {}, RouteRequestBody>, res: Response): Promise<Response> => {
        try {
            const routeId = req.params.id;
            const { path, component, requiredRole, pageId, reportId, workspaceId, icon, name } = req.body;

            if (!path || !component) {
                return res.status(400).json({ 
                    message: "Path e component são campos obrigatórios" 
                });
            }

            const existingRoute = await Route.findOne({ 
                path, 
                _id: { $ne: routeId } 
            });
            
            if (existingRoute) {
                return res.status(400).json({ 
                    message: "Já existe outra rota com este path" 
                });
            }

            const updatedRoute = await Route.findByIdAndUpdate(
                routeId,
                {
                    path,
                    component,
                    name,
                    requiredRole: requiredRole || [],
                    pageId: pageId || "",
                    reportId: reportId || "",
                    workspaceId: workspaceId || "",
                    icon: icon || ""
                },
                { new: true }
            );

            if (!updatedRoute) {
                return res.status(404).json({ 
                    message: "Rota não encontrada" 
                });
            }

            return res.json(updatedRoute);
        } catch (err: unknown) {
            const error = err as Error;
            console.error("Erro ao atualizar rota:", error);
            return res.status(500).json({ 
                message: "Erro ao atualizar rota", 
                error: error.message 
            });
        }
    };

    deleteRoute = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
        try {
            const routeId = req.params.id;
            const deletedRoute = await Route.findByIdAndDelete(routeId);

            if (!deletedRoute) {
                return res.status(404).json({ 
                    message: "Rota não encontrada" 
                });
            }

            return res.json({ 
                message: "Rota excluída com sucesso", 
                route: deletedRoute 
            });
        } catch (err: unknown) {
            const error = err as Error;
            console.error("Erro ao excluir rota:", error);
            return res.status(500).json({ 
                message: "Erro ao excluir rota", 
                error: error.message 
            });
        }
    };
}

export default new RouteController();