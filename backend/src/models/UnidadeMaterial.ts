import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from 'sequelize';

// Interface com os atributos
export interface IUnidadeMaterialAttributes {
  cod_unidade: string;
  desc_unidade: string;
}

// Interface para criação (todos os campos são obrigatórios)
export interface IUnidadeMaterialCreationAttributes
  extends Optional<IUnidadeMaterialAttributes, never> {}

// Modelo Sequelize
export class UnidadeMaterial
  extends Model<IUnidadeMaterialAttributes, IUnidadeMaterialCreationAttributes>
  implements IUnidadeMaterialAttributes
{
  public cod_unidade!: string;
  public desc_unidade!: string;

  // timestamps (caso queira usar futuramente)
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Função para inicializar o modelo
export function initUnidadeMaterial(sequelize: Sequelize): void {
  UnidadeMaterial.init(
    {
      cod_unidade: {
        type: DataTypes.STRING(100),
        allowNull: false,
        primaryKey: true,
        set(value: string) {
          this.setDataValue('cod_unidade', value.trim().toUpperCase());
        }
      },
      desc_unidade: {
        type: DataTypes.STRING(100),
        allowNull: false,
        set(value: string) {
          this.setDataValue('desc_unidade', value.trim());
        }
      }
    },
    {
      sequelize,
      tableName: 'unidade_materiais',
      schema: 'internal',
      timestamps: false
    }
  );
}