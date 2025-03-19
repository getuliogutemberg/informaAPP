export interface Material {
  id: number;                    // cod_item_material
  codigoExterno: number;         // cod_itemmaterial_ext
  nome: string;                  // desc_material
  numeroItem: string;            // desc_numero_itemmaterial
  unidadeMedida: string;        // cod_unidade_medida
  classeId: number;             // cod_classematerial
  grupoId: number;              // cod_grupo
  dataGrupo: string;            // data_grupo
  grupo: string;                // desc_grupo
}

export const materiaisEolicos: Material[] = [
  {
    id: 364,
    codigoExterno: 462,
    nome: "PINCEL TRINCHA TIGRE 12",
    numeroItem: "8773",
    unidadeMedida: "UN",
    classeId: 2,
    grupoId: 1,
    dataGrupo: "2025-03-13",
    grupo: "ABRACADEIRA"
  },
  {
    id: 365,
    codigoExterno: 464,
    nome: "PORCA SEXT CARB 10MM P1,5",
    numeroItem: "8774",
    unidadeMedida: "UN",
    classeId: 2,
    grupoId: 1,
    dataGrupo: "2025-03-13",
    grupo: "ABRACADEIRA"
  },
  {
    id: 366,
    codigoExterno: 465,
    nome: "PORCA SEXT CARB 12MM P1,75",
    numeroItem: "8775",
    unidadeMedida: "UN",
    classeId: 2,
    grupoId: 2,
    dataGrupo: "2025-03-13",
    grupo: "ACELEROMETRO"
  },
  {
    id: 367,
    codigoExterno: 466,
    nome: "PORCA SEXT CARB 16MM P2",
    numeroItem: "8776",
    unidadeMedida: "UN",
    classeId: 2,
    grupoId: 3,
    dataGrupo: "2025-03-13",
    grupo: "ACIONADOR"
  },
  {
    id: 368,
    codigoExterno: 467,
    nome: "PORCA SEXT CARB 316",
    numeroItem: "8777",
    unidadeMedida: "UN",
    classeId: 2,
    grupoId: 4,
    dataGrupo: "2025-03-13",
    grupo: "ACOPLADOR"
  },
  {
    id: 369,
    codigoExterno: 468,
    nome: "PORCA SEXT CARB 4MM P2",
    numeroItem: "8778",
    unidadeMedida: "UN",
    classeId: 2,
    grupoId: 5,
    dataGrupo: "2025-03-13",
    grupo: "ACOPLAMENTO"
  },
  {
    id: 370,
    codigoExterno: 469,
    nome: "PORCA SEXT CARB 516",
    numeroItem: "8779",
    unidadeMedida: "UN",
    classeId: 2,
    grupoId: 6,
    dataGrupo: "2025-03-13",
    grupo: "ADAPTADOR"
  },
  {
    id: 371,
    codigoExterno: 470,
    nome: "PORCA SEXT CARB M8 PASSO 1,25",
    numeroItem: "8780",
    unidadeMedida: "UN",
    classeId: 2,
    grupoId: 7,
    dataGrupo: "2025-03-13",
    grupo: "ALAVANCA"
  },
  {
    id: 372,
    codigoExterno: 471,
    nome: "PORCA SEXT INOX 10MM P1,5",
    numeroItem: "8781",
    unidadeMedida: "UN",
    classeId: 2,
    grupoId: 8,
    dataGrupo: "2025-03-13",
    grupo: "ALOJAMENTO"
  },
  {
    id: 373,
    codigoExterno: 472,
    nome: "PORCA SEXT INOX 12MM P1,75",
    numeroItem: "8782",
    unidadeMedida: "UN",
    classeId: 2,
    grupoId: 9,
    dataGrupo: "2025-03-13",
    grupo: "ANEL"
  }
];
