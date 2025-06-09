import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from 'sequelize';

// Interface com os atributos
export interface IClasseMaterialAttributes {
  cod_classematerial: number;
  desc_classematerial: string;
}

// Interface para criação (cod_classematerial pode ser auto-incrementado)
export interface IClasseMaterialCreationAttributes
  extends Optional<IClasseMaterialAttributes, 'cod_classematerial'> {}

// Modelo Sequelize
export class ClasseMaterial
  extends Model<IClasseMaterialAttributes, IClasseMaterialCreationAttributes>
  implements IClasseMaterialAttributes
{
  public cod_classematerial!: number;
  public desc_classematerial!: string;

  // timestamps (caso queira usar futuramente)
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Função para inicializar o modelo
export function initClasseMaterial(sequelize: Sequelize): void {
  ClasseMaterial.init(
    {
      cod_classematerial: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      desc_classematerial: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        validate: {
          len: {
            args: [1, 1000],
            msg: 'Descrição da classe não pode exceder 1000 caracteres'
          }
        },
        set(value: string) {
          this.setDataValue('desc_classematerial', value.trim());
        }
      }
    },
    {
      sequelize,
      tableName: 'classe_materiais',
      schema: 'internal',
      timestamps: false
    }
  );
}
