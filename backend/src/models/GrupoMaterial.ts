import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from "../database"; // ajuste o caminho conforme necessário

// Interface com todos os atributos
export interface IGrupoMaterialAttributes {
  cod_item_material: number;
  cod_grupo: number;
  data_grupo?: Date;
}

// Campos opcionais na criação
type IGrupoMaterialCreationAttributes = Optional<
  IGrupoMaterialAttributes,
  'data_grupo'
>;

// Model Sequelize
class GrupoMaterial extends Model<IGrupoMaterialAttributes, IGrupoMaterialCreationAttributes>
  implements IGrupoMaterialAttributes {
  public cod_item_material!: number;
  public cod_grupo!: number;
  public data_grupo?: Date;
}

GrupoMaterial.init(
  {
    cod_item_material: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'cadastro_materiais',
        key: 'cod_item_material'
      }
    },
    cod_grupo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dicionario_grupos',
        key: 'cod_grupo'
      }
    },
    data_grupo: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'GrupoMaterial',
    tableName: 'grupo_materiais',
    schema: 'internal', // remova se não usar schemas    timestamps: false,
    indexes: [
      { fields: ['cod_grupo'] }
    ]
  }
);

export default GrupoMaterial;
