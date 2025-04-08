const estrategia_parametros = require("../models/EstrategiaParametros");
const config_parametros = require("../models/ConfigParametros");
const grupo_material = require("../models/GrupoMaterial");

// Define os parâmetros padrão
const parametrosPadrao = [
 
    {
      cod_parametro: 0,
      desc_parametro: "Risco de gerar indisponibilidade da UG",
      tipo: 'boolean',
      opcoes: [
        { cod_opcao: 0, desc_opcao: "FALSE" },
        { cod_opcao: 1, desc_opcao: "TRUE" }
      ]
    },
    {
      cod_parametro: 1,
      desc_parametro: "Risco de gerar indisponibilidade de Sistema de Segurança",
      tipo: 'boolean',
      opcoes: [
        { cod_opcao: 0, desc_opcao: "FALSE" },
        { cod_opcao: 1, desc_opcao: "TRUE" }
      ]
    },
    {
      cod_parametro: 2,
      desc_parametro: "Indisponibilidade do item gera risco de afetar o ativo",
      tipo: 'boolean',
      opcoes: [
        { cod_opcao: 0, desc_opcao: "FALSE" },
        { cod_opcao: 1, desc_opcao: "TRUE" }
      ]
    },
    {
      cod_parametro: 3,
      desc_parametro: "Processo de compras superior a 6 meses",
      tipo: 'radio',
      opcoes: [
        { cod_opcao: 0, desc_opcao: "1 mês" },
        { cod_opcao: 1, desc_opcao: "3 meses" },
        { cod_opcao: 2, desc_opcao: "6 meses" },
        { cod_opcao: 3, desc_opcao: "9 meses" },
        { cod_opcao: 4, desc_opcao: "12 meses" },
        { cod_opcao: 5, desc_opcao: "Acima de 12 meses" }
      ]
    },
    {
      cod_parametro: 4,
      desc_parametro: "Mais de 1 fornecedor disponível",
      tipo: 'radio',
      opcoes: [
        { cod_opcao: 0, desc_opcao: "1" },
        { cod_opcao: 1, desc_opcao: "3" },
        { cod_opcao: 2, desc_opcao: "5" },
        { cod_opcao: 3, desc_opcao: "7" },
        { cod_opcao: 4, desc_opcao: "10 ou mais" }
      ]
    },
    {
      cod_parametro: 5,
      desc_parametro: "Risco de ser descontinuado pelo fabricante em até 2 anos",
      tipo: 'radio',
      opcoes: [
        { cod_opcao: 0, desc_opcao: "N/A" },
        { cod_opcao: 1, desc_opcao: "1 ano" },
        { cod_opcao: 2, desc_opcao: "2 anos" },
        { cod_opcao: 3, desc_opcao: "3 anos ou mais" }
      ]
    },
    {
      cod_parametro: 6,
      desc_parametro: "Item utilizado por pelo menos 10 ativos",
      tipo: 'radio',
      opcoes: [
        { cod_opcao: 0, desc_opcao: "1 ativo" },
        { cod_opcao: 1, desc_opcao: "3 ativos" },
        { cod_opcao: 2, desc_opcao: "5 ativos" },
        { cod_opcao: 3, desc_opcao: "10 ou mais ativos" }
      ]
    },
    {
      cod_parametro: 7,
      desc_parametro: "Alta probabilidade de uso",
      tipo: 'radio',
      opcoes: [
        { cod_opcao: 0, desc_opcao: "Irrisória" },
        { cod_opcao: 1, desc_opcao: "Baixa" },
        { cod_opcao: 2, desc_opcao: "Média" },
        { cod_opcao: 3, desc_opcao: "Alta" },
        { cod_opcao: 4, desc_opcao: "Muito Alta" }
      ]
    },
    {
      cod_parametro: 8,
      desc_parametro: "Item considerado estratégico",
      tipo: 'boolean',
      opcoes: [
        { cod_opcao: 0, desc_opcao: "FALSE" },
        { cod_opcao: 1, desc_opcao: "TRUE" }
      ]
    }
  
  ]

class ParamsController {
  async getGroupParams(req, res) {
    try {
        const { cod_grupo } = req.params;
        
        // Verifica se o grupo existe na tabela grupo_material
        const grupoExiste = await grupo_material.findOne({ cod_grupo });
        if (!grupoExiste) {
            return res.status(404).json({ error: "Grupo não encontrado" });
        }

        let estrategia = await estrategia_parametros.findOne({ cod_grupo });

        if (!estrategia) {
            // Cria os parâmetros padrão no banco se não existirem
            await config_parametros.insertMany(parametrosPadrao);
            
            // Cria a estratégia com os parâmetros padrão
            estrategia = await estrategia_parametros.create({ 
                cod_grupo, 
                cods_parametro: parametrosPadrao.map(p => p.cod_parametro), 
                cods_opcao: parametrosPadrao.map(p => 0),
                client: "default" 
            });
        }

        const parametros = await config_parametros.find({
            cod_parametro: { $in: estrategia.cods_parametro }
        });

        return res.json({ estrategia, parametros });
    } catch (error) {
        console.error('Erro em getGroupParams:', error);
        return res.status(500).json({ error: error.message });
    }
}

async getMaterialParams(req, res) {
    try {
        const { cod_item_material } = req.params;
        
        let estrategia = await estrategia_parametros.findOne({ cod_item_material });

        if (!estrategia) {
            // Cria os parâmetros padrão no banco se não existirem
            await config_parametros.insertMany(parametrosPadrao);
            
            // Cria a estratégia com os parâmetros padrão
            estrategia = await estrategia_parametros.create({ 
                cod_item_material, 
                cods_parametro: parametrosPadrao.map(p => p.cod_parametro), 
                cods_opcao: parametrosPadrao.map(p => 0),
                client: "default" 
            });

            // Retorna os parâmetros padrão
            return res.json({ 
                estrategia, 
                parametros: parametrosPadrao 
            });
        }

        // Busca os parâmetros apenas pelo cod_parametro
        const parametros = await config_parametros.find({
            cod_parametro: { $in: estrategia.cods_parametro }
        });

        // Se não encontrar parâmetros, retorna os padrão
        if (parametros.length === 0) {
            return res.json({ 
                estrategia, 
                parametros: parametrosPadrao 
            });
        }

        return res.json({ estrategia, parametros });
    } catch (error) {
        console.error('Erro em getMaterialParams:', error);
        return res.status(500).json({ error: error.message });
    }
}
    async updateGroupParams(req, res) {
      console.log('req.params',req.params);
      console.log('req.body',req.body)
        try {
          const { cod_grupo } = req.params;
          const { cods_parametro, cods_opcao, client, data_estrategia } = req.body;
          if (!cods_parametro || !cods_opcao) {
            return res.status(400).json({ message: "Parâmetros obrigatórios não foram enviados" });
          }
          if (cods_parametro.length !== cods_opcao.length) {
            return res.status(400).json({ message: "Parâmetros e opções devem ter o mesmo tamanho" });
          }
          const existingStrategies = await estrategia_parametros.find({ cod_grupo });
         
          if (existingStrategies.length > 0) {
            const updateData = {};
            if (cods_parametro) updateData.cods_parametro = cods_parametro;
            if (cods_opcao) updateData.cods_opcao = cods_opcao;
            if (client) updateData.client = client;
            if (data_estrategia) updateData.data_estrategia = data_estrategia;
  
            await estrategia_parametros.updateMany(
              { cod_grupo },
              { $set: updateData }
            );
            return res.json({ message: "Parâmetros atualizados com sucesso" });
          } else {
            const materiaisDoGrupo = await grupo_material.find({ cod_grupo }).distinct("cod_grupo");
      
            if (materiaisDoGrupo.length === 0) {
              return res.status(404).json({ message: "Nenhum item encontrado para esse grupo" });
            }
      
            const novasEstrategias = materiaisDoGrupo.map(cod_grupo => ({
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

    async resetToDefault(req, res) {
        try {
            const { type, id } = req.params; // type pode ser 'group' ou 'material'
            
            // Cria os parâmetros padrão no banco se não existirem
            await config_parametros.insertMany(parametrosPadrao);
            
            if (type === 'group') {
                // Remove estratégia existente do grupo
                await estrategia_parametros.deleteMany({ cod_grupo: id });
                
                // Cria nova estratégia com parâmetros padrão
                const response = await estrategia_parametros.create({ 
                    cod_grupo: id, 
                    cods_parametro: parametrosPadrao.map(p => p.cod_parametro), 
                    cods_opcao: parametrosPadrao.map(p => 0),
                    client: "default" 
                });
                
                return res.json({ 
                    message: "Parâmetros do grupo resetados com sucesso",
                    estrategia: response, 
                    parametros: parametrosPadrao 
                });
            } else if (type === 'material') {
                // Remove estratégia existente do material
                await estrategia_parametros.deleteOne({ cod_item_material: id });
                
                // Cria nova estratégia com parâmetros padrão
                const response = await estrategia_parametros.create({ 
                    cod_item_material: id, 
                    cods_parametro: parametrosPadrao.map(p => p.cod_parametro), 
                    cods_opcao: parametrosPadrao.map(p => 0),
                    client: "default" 
                });
                
                return res.json({ 
                    message: "Parâmetros do material resetados com sucesso",
                    estrategia: response, 
                    parametros: parametrosPadrao 
                });
            } else {
                return res.status(400).json({ error: "Tipo inválido. Use 'group' ou 'material'" });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ParamsController();
