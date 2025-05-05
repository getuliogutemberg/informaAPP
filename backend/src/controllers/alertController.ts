import { Request, Response } from 'express';
import Alert, { IAlert } from '../models/Alert';

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
    public getAllAlerts = async (req: Request, res: Response<IAlert[] | ErrorResponse>): Promise<Response> => {
        try {
            const alerts = (await Alert.find()).filter(alert => !alert.deletedAt);
            return res.json(alerts);
        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error('Erro desconhecido');
            return res.status(500).json({ 
                message: 'Erro ao buscar alertas',
                error: err.message  // Usando 'error' em vez de 'details'
            });
        }
    };

    public createAlert = async (req: Request<{}, {}, AlertRequestBody>, res: Response<IAlert | ErrorResponse>): Promise<Response> => {
        const { type, title, description, color, icon } = req.body;

        if (!type || !title || !description) {
            return res.status(400).json({ 
                message: 'Tipo, título e descrição são obrigatórios' 
            });
        }

        try {
            const alert = new Alert({ type, title, description, color, icon });
            const newAlert = await alert.save();
            return res.status(201).json(newAlert);
        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error('Erro ao criar alerta');
            return res.status(400).json({ 
                message: 'Erro ao criar alerta',
                error: err.message
            });
        }
    };

    public updateAlert = async (req: Request<{ id: string }, {}, AlertRequestBody>, res: Response<IAlert | ErrorResponse>): Promise<Response> => {
        try {
            const { id } = req.params;
            const { type, title, description, color, icon, deletedAt } = req.body;

            if (!type || !title || !description) {
                return res.status(400).json({ 
                    message: 'Tipo, título e descrição são obrigatórios' 
                });
            }

            const updatedAlert = await Alert.findByIdAndUpdate(
                id,
                { type, title, description, color, icon, deletedAt },
                { new: true }
            );

            if (!updatedAlert) {
                return res.status(404).json({ 
                    message: 'Alerta não encontrado!' 
                });
            }

            return res.json(updatedAlert);
        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error('Erro ao atualizar alerta');
            console.error('Erro ao editar o alerta:', err);
            return res.status(500).json({ 
                message: 'Erro ao editar o alerta',
                error: err.message
            });
        }
    };

    public deleteAlert = async (req: Request<{ id: string }>, res: Response<{ message: string } | ErrorResponse>): Promise<Response> => {
        try {
            const deletedAlert = await Alert.findByIdAndDelete(req.params.id);
            
            if (!deletedAlert) {
                return res.status(404).json({ 
                    message: 'Alerta não encontrado' 
                });
            }

            return res.json({ 
                message: 'Alerta removido com sucesso!' 
            });
        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error('Erro ao remover alerta');
            return res.status(400).json({ 
                message: 'Erro ao remover alerta',
                error: err.message
            });
        }
    };
}

export default new AlertController();