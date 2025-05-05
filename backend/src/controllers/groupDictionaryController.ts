import { Request, Response } from 'express';
import DicionarioGrupo, { IDicionarioGrupo } from '../models/DicionarioGrupo';

interface ErrorResponse {
    message: string;
    error?: string;
}

class GroupDictionaryController {
    public async getGroupDictionaries(
        req: Request,
        res: Response<IDicionarioGrupo[] | ErrorResponse>
    ): Promise<Response> {
        try {
            const groupDictionary = await DicionarioGrupo.find();
            
            if (groupDictionary && groupDictionary.length > 0) {
                return res.status(200).json(groupDictionary);
            } else {
                return res.status(404).json({ 
                    message: "Grupo não encontrado" 
                });
            }
        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error('Erro desconhecido');
            return res.status(500).json({ 
                message: "Erro ao buscar grupos",
                error: err.message
            });
        }
    }
}

export default new GroupDictionaryController();