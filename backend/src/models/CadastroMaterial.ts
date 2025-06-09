import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from 'sequelize';

// Interface com os atributos
export interface ICadastroMaterialAttributes {
  cod_item_material: number;
  cod_itemmaterial_ext?: number;
  desc_material: string;
  desc_numero_itemmaterial?: number;
  cod_unidade_medida: string;
  cod_classematerial: number;
}

// Interface para criação (atributos opcionais no insert)
export interface ICadastroMaterialCreationAttributes
  extends Optional<ICadastroMaterialAttributes, 'cod_itemmaterial_ext' | 'desc_numero_itemmaterial'> {}

// Modelo Sequelize
export class CadastroMaterial
  extends Model<ICadastroMaterialAttributes, ICadastroMaterialCreationAttributes>
  implements ICadastroMaterialAttributes
{  
  public cod_item_material!: number;
  public cod_itemmaterial_ext?: number;
  public desc_material!: string;
  public desc_numero_itemmaterial?: number;
  public cod_unidade_medida!: string;
  public cod_classematerial!: number;

  // timestamps (caso queira usar futuramente)
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Função para inicializar o modelo
export function initCadastroMaterial(sequelize: Sequelize): void {
  CadastroMaterial.init(
    {
      cod_item_material: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true
      },
      cod_itemmaterial_ext: {
        type: DataTypes.INTEGER,
        allowNull: true
      },      
      desc_material: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        validate: {
          len: {
            args: [1, 1000],
            msg: 'Descrição não pode exceder 1000 caracteres'
          }
        }
      },
      desc_numero_itemmaterial: {
        type: DataTypes.INTEGER,
        allowNull: true
      },      
      cod_unidade_medida: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        references: {
          model: 'unidade_materiais',
          key: 'cod_unidade'
        },
        set(value: string) {
          this.setDataValue('cod_unidade_medida', value.trim().toUpperCase());
        }
      },
      cod_classematerial: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'classe_materiais',
          key: 'cod_classematerial'
        }
      }
    },
    {
      sequelize,
      tableName: 'cadastro_materiais',
      schema: 'internal',
      timestamps: false
    }
  );
}
