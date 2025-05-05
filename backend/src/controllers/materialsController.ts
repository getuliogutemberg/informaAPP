import { Request, Response } from 'express';
import GrupoMaterial, { IGrupoMaterial } from '../models/GrupoMaterial';
import CadastroMaterial, { ICadastroMaterial } from '../models/CadastroMaterial';

interface ErrorResponse {
    message: string;
    error?: string;
}

interface MaterialResponse extends ICadastroMaterial {}

class MaterialController {
    public async getMaterialByGroup(
        req: Request<{ cod_grupo: string }>,
        res: Response<MaterialResponse[] | ErrorResponse>
    ): Promise<Response> {
        try {
            const { cod_grupo } = req.params;

            if (!cod_grupo) {
                return res.status(400).json({ 
                    message: "O código do grupo é obrigatório." 
                });
            }

            // Busca os materiais do grupo
            const materiaisDoGrupo: IGrupoMaterial[] = await GrupoMaterial.find({ 
                cod_grupo: cod_grupo 
            });

            if (materiaisDoGrupo.length === 0) {
                return res.status(404).json({ 
                    message: "Nenhum material encontrado para este grupo." 
                });
            }

            // Extrai os códigos dos materiais
            const codigosMateriais = materiaisDoGrupo.map(m => m.cod_item_material);

            // Busca os detalhes dos materiais
            const materiais: ICadastroMaterial[] = await CadastroMaterial.find({ 
                cod_item_material: { $in: codigosMateriais } 
            });

            return res.status(200).json(materiais);

        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error('Erro desconhecido');
            return res.status(500).json({ 
                message: "Erro ao buscar materiais",
                error: err.message
            });
        }
    }
}

export default new MaterialController();