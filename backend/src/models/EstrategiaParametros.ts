import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from "../database"; // ajuste o caminho se necessário

// Interface com todos os atributos
export interface IEstrategiaParametros {
  cod_grupo: number;
  cod_item_material: number;
  client: string;
  cods_parametro: number[];
  cods_opcao: number[];
  data_estrategia: Date;
}

// Campos opcionais na criação
type IEstrategiaParametrosCreationAttributes = Optional<
  IEstrategiaParametros,
  'data_estrategia'
>;

// Definição do model
class EstrategiaParametros extends Model<
  IEstrategiaParametros,
  IEstrategiaParametrosCreationAttributes
> implements IEstrategiaParametros {
  public cod_grupo!: number;
  public cod_item_material!: number;
  public client!: string;
  public cods_parametro!: number[];
  public cods_opcao!: number[];
  public data_estrategia!: Date;
}

EstrategiaParametros.init(
  {
    cod_grupo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: {
          tableName: 'dicionario_grupos',
          schema: 'internal'
        },
        key: 'cod_grupo'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },    
    cod_item_material: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: {
          tableName: 'cadastro_materiais',
          schema: 'internal'
        },
        key: 'cod_item_material'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    client: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: 'default',
    },
    cods_parametro: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Deve haver pelo menos um código de parâmetro',
        },
      },
    },
    cods_opcao: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
      validate: {
        isLengthMatch(value: number[]) {
          if (
            !Array.isArray(this.cods_parametro) ||
            value.length !== this.cods_parametro.length
          ) {
            throw new Error(
              'Deve ter o mesmo número de códigos de opção que de parâmetros'
            );
          }
        },
      },
    },
    data_estrategia: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'EstrategiaParametros',
    tableName: 'estrategia_parametros',
    schema: 'internal',
    timestamps: false,
    indexes: [
      { fields: ['cod_grupo'] },
      { fields: ['cod_item_material'] },
      { fields: ['data_estrategia'] },
    ],
  }
);

export default EstrategiaParametros;
