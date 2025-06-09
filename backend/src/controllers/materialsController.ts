import { Request, Response } from 'express';
import GrupoMaterial,{ IGrupoMaterialAttributes } from '../models/GrupoMaterial';
import { CadastroMaterial,  ICadastroMaterialAttributes } from '../models/CadastroMaterial';
import { initializeModels } from '../models/index';

interface ErrorResponse {
  message: string;
  error?: string;
} 

class MaterialController {
  public async getMaterialByGroup(
    req: Request<{ cod_grupo: string }>,
    res: Response<ICadastroMaterialAttributes[] | ErrorResponse>
  ): Promise<Response> {
    try {
      // Inicializar os modelos
      initializeModels();
      
      const { cod_grupo } = req.params;

      if (!cod_grupo) {
        return res.status(400).json({
          message: "O código do grupo é obrigatório."
        });
      }

      // Busca os materiais do grupo (onde cod_grupo bate)
      const materiaisDoGrupo = await GrupoMaterial.findAll({
        where: { cod_grupo: Number(cod_grupo) }
      });

      if (materiaisDoGrupo.length === 0) {
        return res.status(404).json({
          message: "Nenhum material encontrado para este grupo."
        });
      }

      // Extrai os códigos dos materiais
      const codigosMateriais = materiaisDoGrupo.map(m => m.cod_item_material);

      // Busca os detalhes dos materiais pelo cod_item_material
      const materiais = await CadastroMaterial.findAll({
        where: {
          cod_item_material: codigosMateriais
        }
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
