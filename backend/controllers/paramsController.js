const estrategia_parametros = require("../models/EstrategiaParametros");
const config_parametros = require("../models/ConfigParametros");
const grupo_material = require("../models/GrupoMaterial");

class ParamsController {
    async getGroupParams(req, res) {
        try {
            const { cod_grupo } = req.params;

            const estrategia = await estrategia_parametros.findOne({ cod_grupo });

            if (!estrategia) {
            return res.json([]);
            }

            const parametros = await config_parametros.find({
            cod_parametro: { $in: estrategia.cods_parametro },
            cod_opcao: { $in: estrategia.cods_opcao },
            client: estrategia.client,
            });

            return res.json({ estrategia, parametros });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getMaterialParams(req, res) {
        try {
            const { cod_item_material } = req.params;

            const estrategia = await estrategia_parametros.findOne({ cod_item_material });

            if (!estrategia) {
            return res.json([]);
            }

            const parametros = await config_parametros.find({
            cod_parametro: { $in: estrategia.cods_parametro },
            cod_opcao: { $in: estrategia.cods_opcao },
            client: estrategia.client,
            });

            return res.json({ estrategia, parametros });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateGroupParams(req, res) {
        try {
          const { cod_grupo } = req.params;
          const { cods_parametro, cods_opcao, client, data_estrategia } = req.body;
      
          const existingStrategies = await estrategia_parametros.find({ cod_grupo });
      
          if (existingStrategies.length > 0) {
            await estrategia_parametros.updateMany(
              { cod_grupo },
              { $set: { cods_parametro, cods_opcao, client, data_estrategia } }
            );
            return res.json({ message: "Parâmetros atualizados com sucesso" });
          } else {
            const materiaisDoGrupo = await grupo_material.find({ cod_grupo }).distinct("cod_item_material");
      
            if (materiaisDoGrupo.length === 0) {
              return res.status(404).json({ message: "Nenhum item encontrado para esse grupo" });
            }
      
            const novasEstrategias = materiaisDoGrupo.map(cod_item_material => ({
              cod_grupo,
              cod_item_material,
              cods_parametro,
              cods_opcao,
              client,
              data_estrategia
            }));
            
            await estrategia_parametros.insertMany(novasEstrategias);
      
            return res.json({ message: "Novas estratégias criadas para todos os itens do grupo", estrategias: novasEstrategias });
          }
      
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
    }
    
    async updateMaterialParams(req, res) {
        try {
          const { cod_item_material } = req.params;
          const { cods_parametro, cods_opcao, client, data_estrategia } = req.body;
    
          const estrategia = await estrategia_parametros.findOneAndUpdate(
            { cod_item_material },
            { cods_parametro, cods_opcao, client, data_estrategia },
          );
    
          return res.json({ message: "Parâmetros atualizados com sucesso", estrategia });
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ParamsController();
