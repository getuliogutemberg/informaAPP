import { Request, Response } from 'express';
import { Alert, IAlertAttributes } from '../models/Alert';

interface AlertRequestBody {
  type: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
  deletedAt?: Date | null;
}

interface ErrorResponse {
  message: string;
  error?: string;
}

class AlertController {
    public getAllAlerts = async (req: Request, res: Response<IAlertAttributes[] | ErrorResponse>): Promise<Response> => {
      try {
        // Com paranoid: true, findAll já ignora registros soft deleted
        const alerts = await Alert.findAll();
        return res.json(alerts);
      } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error('Erro desconhecido');
        return res.status(500).json({
          message: 'Erro ao buscar alertas',
          error: err.message,
        });
      }
    };
  
    public createAlert = async (req: Request<{}, {}, AlertRequestBody>, res: Response<IAlertAttributes | ErrorResponse>): Promise<Response> => {
      const { type, title, description, color, icon } = req.body;
  
      if (!type || !title || !description) {
        return res.status(400).json({
          message: 'Tipo, título e descrição são obrigatórios',
        });
      }
  
      try {
        const newAlert = await Alert.create({ type, title, description, color, icon });
        return res.status(201).json(newAlert);
      } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error('Erro ao criar alerta');
        return res.status(400).json({
          message: 'Erro ao criar alerta',
          error: err.message,
        });
      }
    };
  
    public updateAlert = async (
      req: Request<{ id: string }, {}, AlertRequestBody>,
      res: Response<IAlertAttributes | ErrorResponse>
    ): Promise<Response> => {
      try {
        const { id } = req.params;
        const { type, title, description, color, icon } = req.body;
  
        if (!type || !title || !description) {
          return res.status(400).json({
            message: 'Tipo, título e descrição são obrigatórios',
          });
        }
  
        const alert = await Alert.findByPk(id);
        if (!alert) {
          return res.status(404).json({ message: 'Alerta não encontrado!' });
        }
  
        await alert.update({ type, title, description, color, icon });
        return res.json(alert);
      } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error('Erro ao atualizar alerta');
        console.error('Erro ao editar o alerta:', err);
        return res.status(500).json({
          message: 'Erro ao editar o alerta',
          error: err.message,
        });
      }
    };
  
    public deleteAlert = async (
      req: Request<{ id: string }>,
      res: Response<{ message: string } | ErrorResponse>
    ): Promise<Response> => {
      try {
        const alert = await Alert.findByPk(req.params.id);
        if (!alert) {
          return res.status(404).json({ message: 'Alerta não encontrado' });
        }
  
        await alert.destroy(); // soft delete por causa do paranoid: true
        return res.json({ message: 'Alerta removido com sucesso!' });
      } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error('Erro ao remover alerta');
        return res.status(400).json({
          message: 'Erro ao remover alerta',
          error: err.message,
        });
      }
    };
  }
  
  export default new AlertController();