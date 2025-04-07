type Opcao = { cod_opcao: string | number; desc_opcao: string };

type CriterioComResposta = {
  cod_parametro: number;
  var_name: string;
  desc_parametro: string;
  tipo: string;
  opcoes: Opcao[];
  resposta?: string | boolean | number;
};

const CRITERIOS_PADRAO: CriterioComResposta[] = [
    {
      cod_parametro: 0,
      var_name: 'indisponibilidade_UG',
      desc_parametro: "Risco de gerar indisponibilidade da UG",
      tipo: 'boolean',
      opcoes: [
        { cod_opcao: 0, desc_opcao: "FALSE" },
        { cod_opcao: 1, desc_opcao: "TRUE" }
      ]
    },
    {
      cod_parametro: 1,
      var_name: 'indisponibilidade_SEG',
      desc_parametro: "Risco de gerar indisponibilidade de Sistema de Segurança",
      tipo: 'boolean',
      opcoes: [
        { cod_opcao: 0, desc_opcao: "FALSE" },
        { cod_opcao: 1, desc_opcao: "TRUE" }
      ]
    },
    {
      cod_parametro: 2,
      var_name: 'afeta_ativo',
      desc_parametro: "Indisponibilidade do item gera risco de afetar o ativo",
      tipo: 'boolean',
      opcoes: [
        { cod_opcao: 0, desc_opcao: "FALSE" },
        { cod_opcao: 1, desc_opcao: "TRUE" }
      ]
    },
    {
      cod_parametro: 3,
      var_name: 'leadtime',
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
      var_name: 'diversidade_fornecedor',
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
      var_name: 'descontinuidade_material',
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
      var_name: 'multiplos_ativos',
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
      var_name: 'probabilidade_uso',    
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
      var_name: 'opiniao_especialista',
      desc_parametro: "Item considerado estratégico",
      tipo: 'boolean',
      opcoes: [
        { cod_opcao: 0, desc_opcao: "FALSE" },
        { cod_opcao: 1, desc_opcao: "TRUE" }
      ]
    }
  ];

  export default CRITERIOS_PADRAO;