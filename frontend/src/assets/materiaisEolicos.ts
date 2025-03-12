export interface Material {
  id: number;
  codigo: string;
  nome: string;
  grupo: string;
  categoria: string;
  classificacaoRisco: string;
  unidadeMedida: string;
  estoque: number;
  estoqueMinimo: number;
  crit1: number;
  crit2: number;
}

export const materiaisEolicos: Material[] = [
  {
    id: 1,
    codigo: "ELE001",
    nome: "Conversor de Frequência 690V",
    grupo: "Componentes Elétricos",
    categoria: "Alta Tensão",
    classificacaoRisco: "Alto",
    unidadeMedida: "Unidade",
    estoque: 2,
    estoqueMinimo: 1,
    crit1: 3,
    crit2: 4
  },
  {
    id: 2,
    codigo: "MEC001",
    nome: "Rolamento Principal do Rotor",
    grupo: "Componentes Mecânicos",
    categoria: "Rolamentos",
    classificacaoRisco: "Alto",
    unidadeMedida: "Unidade",
    estoque: 1,
    estoqueMinimo: 1,
    crit1: 3,
    crit2: 4
  },
  {
    id: 3,
    codigo: "PAS001",
    nome: "Kit Reparo de Pá",
    grupo: "Pás",
    categoria: "Estrutural",
    classificacaoRisco: "Alto",
    unidadeMedida: "Kit",
    estoque: 5,
    estoqueMinimo: 3,
    crit1: 2,
    crit2: 3
  },
  {
    id: 4,
    codigo: "SEN001",
    nome: "Sensor de Velocidade do Vento",
    grupo: "Sensores",
    categoria: "Velocidade",
    classificacaoRisco: "Médio",
    unidadeMedida: "Unidade",
    estoque: 8,
    estoqueMinimo: 4,
    crit1: 2,
    crit2: 3
  },
  {
    id: 5,
    codigo: "HID001",
    nome: "Bomba Hidráulica Principal",
    grupo: "Hidráulicos",
    categoria: "Bombas",
    classificacaoRisco: "Alto",
    unidadeMedida: "Unidade",
    estoque: 2,
    estoqueMinimo: 1,
    crit1: 3,
    crit2: 4
  },
  {
    id: 6,
    codigo: "SEG001",
    nome: "Trava-Quedas Retrátil",
    grupo: "Segurança",
    categoria: "EPI",
    classificacaoRisco: "Alto",
    unidadeMedida: "Unidade",
    estoque: 15,
    estoqueMinimo: 10,
    crit1: 2,
    crit2: 3
  },
  {
    id: 7,
    codigo: "LUB001",
    nome: "Óleo de Engrenagem Sintético",
    grupo: "Lubrificantes",
    categoria: "Óleo de Engrenagem",
    classificacaoRisco: "Médio",
    unidadeMedida: "Litro",
    estoque: 200,
    estoqueMinimo: 100,
    crit1: 2,
    crit2: 3
  },
  {
    id: 8,
    codigo: "TOR001",
    nome: "Parafusos de Fixação M36",
    grupo: "Torre",
    categoria: "Fixação",
    classificacaoRisco: "Alto",
    unidadeMedida: "Conjunto",
    estoque: 30,
    estoqueMinimo: 20,
    crit1: 2,
    crit2: 3
  },
  {
    id: 9,
    codigo: "FER001",
    nome: "Torquímetro Hidráulico",
    grupo: "Ferramentas",
    categoria: "Mecânicas",
    classificacaoRisco: "Médio",
    unidadeMedida: "Unidade",
    estoque: 3,
    estoqueMinimo: 2,
    crit1: 2,
    crit2: 3
  },
  {
    id: 10,
    codigo: "CTR001",
    nome: "PLC de Controle Principal",
    grupo: "Sistema de Controle",
    categoria: "Hardware",
    classificacaoRisco: "Alto",
    unidadeMedida: "Unidade",
    estoque: 1,
    estoqueMinimo: 1,
    crit1: 3,
    crit2: 4
  },
  {
    id: 11,
    codigo: "ELE002",
    nome: "Transformador 690V/400V",
    grupo: "Componentes Elétricos",
    categoria: "Alta Tensão",
    classificacaoRisco: "Alto",
    unidadeMedida: "Unidade",
    estoque: 2,
    estoqueMinimo: 1,
    crit1: 3,
    crit2: 4
  },
  {
    id: 12,
    codigo: "MEC002",
    nome: "Caixa de Engrenagens",
    grupo: "Componentes Mecânicos",
    categoria: "Engrenagens",
    classificacaoRisco: "Alto",
    unidadeMedida: "Conjunto",
    estoque: 1,
    estoqueMinimo: 1,
    crit1: 3,
    crit2: 4
  },
  {
    id: 13,
    codigo: "SEN002",
    nome: "Sensor de Vibração",
    grupo: "Sensores",
    categoria: "Vibração",
    classificacaoRisco: "Médio",
    unidadeMedida: "Unidade",
    estoque: 6,
    estoqueMinimo: 3,
    crit1: 2,
    crit2: 3
  },
  {
    id: 14,
    codigo: "HID002",
    nome: "Válvula de Controle Proporcional",
    grupo: "Hidráulicos",
    categoria: "Válvulas",
    classificacaoRisco: "Alto",
    unidadeMedida: "Unidade",
    estoque: 4,
    estoqueMinimo: 2,
    crit1: 2,
    crit2: 3
  },
  {
    id: 15,
    codigo: "LUB002",
    nome: "Graxa Sintética Especial",
    grupo: "Lubrificantes",
    categoria: "Graxa",
    classificacaoRisco: "Baixo",
    unidadeMedida: "Kg",
    estoque: 50,
    estoqueMinimo: 20,
    crit1: 1,
    crit2: 2
  }
];