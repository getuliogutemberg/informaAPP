import { Request, Response } from 'express';
import Configuration from '../models/Configuration';

// Interface para o objeto de configuração filtrado (sem campos do Mongoose)
interface FilteredConfiguration {
    [key: string]: any;
}

class ConfigurationController {
    public getConfiguration = async (req: Request, res: Response<FilteredConfiguration | { message: string }>): Promise<Response> => {
        try {
            let config = await Configuration.findOne();

            if (config) {
                const { _id, createdAt, updatedAt, __v, ...filteredConfig } = config.toObject();
                return res.json(filteredConfig);
            } else {
                const newConfig = new Configuration();
                await newConfig.save();

                const { _id, createdAt, updatedAt, __v, ...filteredNewConfig } = newConfig.toObject();
                return res.json(filteredNewConfig);
            }
        } catch (error: unknown) {
            console.error("Erro ao buscar configurações:", error);
            return res.status(500).json({ message: "Erro ao buscar configurações" });
        }
    };

    public updateConfiguration = async (req: Request, res: Response<FilteredConfiguration | { message: string }>): Promise<Response> => {
        try {
            const updatedConfig = await Configuration.findOneAndUpdate({}, req.body, { 
                new: true,
                upsert: true 
            });

            if (!updatedConfig) {
                return res.status(404).json({ message: "Configuração não encontrada" });
            }

            const { _id, createdAt, updatedAt, __v, ...filteredConfig } = updatedConfig.toObject();
            return res.json(filteredConfig);
        } catch (error: unknown) {
            console.error("Erro ao atualizar configurações:", error);
            return res.status(500).json({ message: "Erro ao atualizar configurações" });
        }
    };
}

export default new ConfigurationController();