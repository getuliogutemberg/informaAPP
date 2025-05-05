import { Request, Response } from 'express';
import EstrategiaParametros, { IEstrategiaParametros } from '../models/EstrategiaParametros';
import GrupoMaterial from '../models/GrupoMaterial';

interface EstrategiaPadrao {
  cod_grupo: number;
  cod_item_material: number;
  client: string;
  cods_parametro: number[];
  cods_opcao: number[];
  data_estrategia: Date;
}

interface UpdateGroupParamsBody {
  cods_parametro: number[];
  cods_opcao: number[];
  client: string;
  data_estrategia: Date;
  onlyMatchingGroupParams?: boolean;
}

interface UpdateMaterialParamsBody {
  cods_parametro: number[];
  cods_opcao: number[];
  client: string;
  data_estrategia: Date;
}

class ParamsController {
  async getGroupParams(req: Request, res: Response): Promise<Response> {
    try {
      const { groupId } = req.params;
      const estrategia = await EstrategiaParametros.findOne({ cod_grupo: Number(groupId), cod_item_material: 0 });

      if (!estrategia) {
        const estrategiaPadrao: EstrategiaPadrao = {
          cod_grupo: Number(groupId),
          cod_item_material: 0,
          client: 'default',
          cods_parametro: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          cods_opcao: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          data_estrategia: new Date(),
        };
        return res.json(estrategiaPadrao);
      }

      return res.json(estrategia);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro desconhecido' });
    }
  }

  async getMaterialParams(req: Request, res: Response): Promise<Response> {
    try {
      const { materialId } = req.params;

      const estrategia = await EstrategiaParametros.findOne({ cod_item_material: Number(materialId) });

      if (!estrategia) {
        const material = await GrupoMaterial.findOne({ cod_item_material: Number(materialId) });

        if (!material) {
          return res.status(404).json({ message: 'Material não encontrado' });
        }

        const estrategiaPadrao: EstrategiaPadrao = {
          cod_grupo: material.cod_grupo,
          cod_item_material: Number(materialId),
          client: 'default',
          cods_parametro: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          cods_opcao: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          data_estrategia: new Date(),
        };
        return res.json({ 
          message: 'Item atualmente sem estratégia, retornando padrão', 
          estrategiaPadrao 
        });
      } else {
        return res.json(estrategia);
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro desconhecido' });
    }
  }

  async updateGroupParams(req: Request, res: Response): Promise<Response> {
    try {
      const { groupId } = req.params;
      const { cods_parametro, cods_opcao, client, data_estrategia, onlyMatchingGroupParams } = req.body as UpdateGroupParamsBody;

      const existingStrategies = await EstrategiaParametros.find({ 
        cod_grupo: Number(groupId), 
        cod_item_material: 0 
      });

      if (existingStrategies.length > 0) {
        await EstrategiaParametros.updateMany(
          { cod_grupo: Number(groupId), cod_item_material: 0 },
          { cods_parametro, cods_opcao, client, data_estrategia }
        );

        // Filtrando apenas itens com parâmetros iguais ao grupo
        const filter: any = { 
          cod_grupo: Number(groupId), 
          cod_item_material: { $ne: 0 } 
        };
        
        if (onlyMatchingGroupParams) {
          filter.cods_parametro = existingStrategies[0].cods_parametro;
          filter.cods_opcao = existingStrategies[0].cods_opcao;
        }

        // Atualiza os materiais conforme o filtro
        await EstrategiaParametros.updateMany(
          filter,
          { $set: { cods_parametro, cods_opcao, client, data_estrategia } }
        );

        return res.json({ message: "Parâmetros atualizados com sucesso" });
      } else {
        const materiaisDoGrupo = await GrupoMaterial.find({ cod_grupo: Number(groupId) }).distinct("cod_item_material");

        if (materiaisDoGrupo.length === 0) {
          return res.status(404).json({ message: "Nenhum item encontrado para esse grupo" });
        }

        const novasEstrategias: IEstrategiaParametros[] = [
          // Primeiro adiciona a estratégia do grupo (cod_item_material = 0)
          {
            cod_grupo: Number(groupId),
            cod_item_material: 0,  // Estratégia base do grupo
            cods_parametro,
            cods_opcao,
            client,
            data_estrategia
          } as IEstrategiaParametros,
          // Depois adiciona as estratégias para cada material
          ...materiaisDoGrupo.map(cod_item_material => ({
            cod_grupo: Number(groupId),
            cod_item_material,
            cods_parametro,
            cods_opcao,
            client,
            data_estrategia
          } as IEstrategiaParametros))
        ];
        
        await EstrategiaParametros.insertMany(novasEstrategias);

        return res.json({ estrategias: novasEstrategias });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro desconhecido' });
    }
  }

  async updateMaterialParams(req: Request, res: Response): Promise<Response> {
    try {
      const { materialId } = req.params;
      const { cods_parametro, cods_opcao, client, data_estrategia } = req.body as UpdateMaterialParamsBody;
      
      const existingStrategy = await EstrategiaParametros.findOne({ cod_item_material: Number(materialId) });

      if (!existingStrategy) {
        return res.status(404).json({ 
          message: "Estratégia base do grupo não configurada",
          details: `Não existe uma estratégia padrão para o grupo desse item`,
          solution: "Defina primeiro os parâmetros do grupo antes de atualizar itens individuais"
        });
      }

      const estrategia = await EstrategiaParametros.findOneAndUpdate(
        { cod_item_material: Number(materialId) },
        { cods_parametro, cods_opcao, client, data_estrategia },
        { new: true }
      );

      return res.json({ message: "Parâmetros atualizados com sucesso", estrategia });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro desconhecido' });
    }
  }

  async resetGroupItems(req: Request, res: Response): Promise<Response> {
    try {
      const { groupId } = req.params;

      const grupoParams = await EstrategiaParametros.findOne({ 
        cod_grupo: Number(groupId), 
        cod_item_material: 0 
      });

      if (!grupoParams) {
        return res.status(404).json({ message: "Parâmetros base do grupo não encontrados" });
      }

      const novasEstrategias = await EstrategiaParametros.updateMany(
        { cod_grupo: Number(groupId), cod_item_material: { $ne: 0 } },
        { 
          cods_parametro: grupoParams.cods_parametro, 
          cods_opcao: grupoParams.cods_opcao, 
          client: grupoParams.client, 
          data_estrategia: new Date()
        },
        { new: true }
      );

      return res.json({ estrategias: novasEstrategias });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro desconhecido' });
    }
  }

  async resetItem(req: Request, res: Response): Promise<Response> {
    try {
      const { materialId } = req.params;

      const material = await GrupoMaterial.findOne({ cod_item_material: Number(materialId) });

      if (!material) {
        return res.status(404).json({ message: "Item não encontrado" });
      }

      const groupId = material.cod_grupo;

      const grupoParams = await EstrategiaParametros.findOne({ 
        cod_grupo: groupId, 
        cod_item_material: 0 
      });

      if (!grupoParams) {
        return res.status(404).json({ message: "Parâmetros base do grupo não encontrados" });
      }

      const estrategia = await EstrategiaParametros.findOneAndUpdate(
        { cod_item_material: Number(materialId) },
        { 
          cods_parametro: grupoParams.cods_parametro, 
          cods_opcao: grupoParams.cods_opcao, 
          client: grupoParams.client, 
          data_estrategia: new Date()
        },
        { new: true }
      );

      return res.json({ 
        message: "Item atualizado com os parâmetros do grupo", 
        estrategia 
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro desconhecido' });
    }
  }
}

export default new ParamsController();