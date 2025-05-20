import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Route from '../models/Route';

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
    getRoutes = async (req: Request, res: Response): Promise<void> => {
        try {
          // Verifica se já existem rotas no banco
          let routes = await Route.findAll();
      
          // Se não houver rotas, cria as rotas padrão
          if (routes.length === 0) {
            const defaultRoutes = [
              // Exemplo de rota
              {
                id:'01',
                path: '/dashboard',
                component: 'Dashboard',
                name: 'Dashboard',
                requiredRole: ['admin', 'user'],
                icon: 'DashboardIcon',
              },
              // Adicione mais aqui se quiser
            ];
      
            if (defaultRoutes.length > 0) {
              await Route.bulkCreate(defaultRoutes);
              routes = await Route.findAll();
              console.log("Rotas padrão inseridas com sucesso.");
            }
      
            res.status(200).json(routes);
            return;
          }
      
          res.status(200).json(routes);
        } catch (err: any) {
          console.error("Erro ao buscar rotas:", err);
          res.status(500).json({ message: "Erro ao buscar rotas", error: err.message });
        }
      };

    createRoute = async (req: Request, res: Response): Promise<void> => {
        try {
          const {id, path, component, requiredRole, pageId, reportId, icon, name, workspaceId } = req.body;
      
          // Validações básicas
          if (!path || !component) {
            res.status(400).json({
              message: "Path e component são campos obrigatórios"
            });
            return;
          }
      
          // Verifica se já existe uma rota com o mesmo path
          const existingRoute = await Route.findOne({ where: { path } });
          if (existingRoute) {
            res.status(400).json({
              message: "Já existe uma rota com este path"
            });
            return;
          }
      
          // Cria e salva a nova rota no banco de dados
          const savedRoute = await Route.create({
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
        } catch (err: any) {
          console.error("Erro ao criar rota:", err);
          res.status(500).json({
            message: "Erro ao criar rota",
            error: err.message
          });
        }
      };

    updateRoute = async (req: Request, res: Response): Promise<void> => {
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
          const existingRoute = await Route.findOne({
            where: {
              path,
                id: { [Op.ne]: routeId }
            }
          });
      
          if (existingRoute) {
            res.status(400).json({
              message: "Já existe outra rota com este path"
            });
            return;
          }
      
          // Atualiza a rota
          const [affectedRows] = await Route.update(
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
            {
                where: { id: routeId },
                returning: true
              }
          );
      
          if (affectedRows === 0) {
            res.status(404).json({
              message: "Rota não encontrada"
            });
            return;
          }
      
          const updatedRoute = await Route.findByPk(routeId);
          res.json(updatedRoute);
        } catch (err: any) {
          console.error("Erro ao atualizar rota:", err);
          res.status(500).json({
            message: "Erro ao atualizar rota",
            error: err.message
          });
        }
      };;

    deleteRoute = async (req: Request, res: Response): Promise<void> => {
        try {
          const routeId = req.params.id;
      
          const deletedRoute = await Route.findByPk(routeId);
      
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
      
        } catch (err: any) {
          console.error("Erro ao excluir rota:", err);
          res.status(500).json({ 
            message: "Erro ao excluir rota", 
            error: err.message 
          });
        }
      };
}

export default new RouteController();