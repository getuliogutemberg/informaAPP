export interface GrupoMaterial {
  id: number;
  nome: string;
  tipo: string;
  descricao: string;
  especificacoes: {
    categoriasDisponiveis: string[];
    classificacaoRisco: string[];
    unidadesMedida: string[];
  };
}

export const gruposMateriaisEolicos: GrupoMaterial[] = [
  {
    id: 1,
    nome: "Componentes Elétricos",
    tipo: "Material Crítico",
    descricao: "Componentes elétricos essenciais para o funcionamento do sistema de geração e controle",
    especificacoes: {
      categoriasDisponiveis: ["Alta Tensão", "Baixa Tensão", "Controle", "Proteção"],
      classificacaoRisco: ["Alto", "Médio", "Baixo"],
      unidadesMedida: ["Unidade", "Metro", "Conjunto"]
    }
  },
  {
    id: 2,
    nome: "Componentes Mecânicos",
    tipo: "Material Crítico",
    descricao: "Peças mecânicas para manutenção do sistema de transmissão e rotação",
    especificacoes: {
      categoriasDisponiveis: ["Rolamentos", "Engrenagens", "Eixos", "Acoplamentos"],
      classificacaoRisco: ["Alto", "Médio", "Baixo"],
      unidadesMedida: ["Unidade", "Conjunto", "Kit"]
    }
  },
  {
    id: 3,
    nome: "Pás",
    tipo: "Componente Estrutural",
    descricao: "Componentes e materiais relacionados à manutenção das pás do aerogerador",
    especificacoes: {
      categoriasDisponiveis: ["Revestimento", "Estrutural", "Balanceamento", "Proteção"],
      classificacaoRisco: ["Alto", "Médio"],
      unidadesMedida: ["Metro", "Litro", "Kit", "Unidade"]
    }
  },
  {
    id: 4,
    nome: "Sensores",
    tipo: "Equipamento de Controle",
    descricao: "Sensores para monitoramento de temperatura, velocidade, vibração e posição",
    especificacoes: {
      categoriasDisponiveis: ["Temperatura", "Velocidade", "Vibração", "Posição"],
      classificacaoRisco: ["Alto", "Médio"],
      unidadesMedida: ["Unidade", "Conjunto"]
    }
  },
  {
    id: 5,
    nome: "Hidráulicos",
    tipo: "Sistema de Controle",
    descricao: "Componentes do sistema hidráulico de controle e freios",
    especificacoes: {
      categoriasDisponiveis: ["Bombas", "Válvulas", "Mangueiras", "Cilindros"],
      classificacaoRisco: ["Alto", "Médio", "Baixo"],
      unidadesMedida: ["Unidade", "Metro", "Litro"]
    }
  },
  {
    id: 6,
    nome: "Segurança",
    tipo: "Equipamento de Proteção",
    descricao: "Equipamentos de segurança para manutenção e operação",
    especificacoes: {
      categoriasDisponiveis: ["EPI", "Sinalização", "Resgate", "Proteção Coletiva"],
      classificacaoRisco: ["Alto", "Médio"],
      unidadesMedida: ["Unidade", "Conjunto", "Par"]
    }
  },
  {
    id: 7,
    nome: "Lubrificantes",
    tipo: "Material de Consumo",
    descricao: "Óleos e graxas para lubrificação dos componentes mecânicos",
    especificacoes: {
      categoriasDisponiveis: ["Óleo Hidráulico", "Graxa", "Óleo de Engrenagem", "Aditivos"],
      classificacaoRisco: ["Médio", "Baixo"],
      unidadesMedida: ["Litro", "Kg", "Galão"]
    }
  },
  {
    id: 8,
    nome: "Torre",
    tipo: "Componente Estrutural",
    descricao: "Materiais para manutenção estrutural da torre",
    especificacoes: {
      categoriasDisponiveis: ["Estrutural", "Fixação", "Proteção", "Acesso"],
      classificacaoRisco: ["Alto", "Médio"],
      unidadesMedida: ["Unidade", "Metro", "Conjunto"]
    }
  },
  {
    id: 9,
    nome: "Ferramentas",
    tipo: "Equipamento de Manutenção",
    descricao: "Ferramentas especializadas para manutenção dos aerogeradores",
    especificacoes: {
      categoriasDisponiveis: ["Mecânicas", "Elétricas", "Hidráulicas", "Calibração"],
      classificacaoRisco: ["Médio", "Baixo"],
      unidadesMedida: ["Unidade", "Conjunto", "Kit"]
    }
  },
  {
    id: 10,
    nome: "Sistema de Controle",
    tipo: "Equipamento Eletrônico",
    descricao: "Componentes do sistema de controle e monitoramento",
    especificacoes: {
      categoriasDisponiveis: ["Hardware", "Sensores", "Comunicação", "Interface"],
      classificacaoRisco: ["Alto", "Médio"],
      unidadesMedida: ["Unidade", "Conjunto"]
    }
  }
];