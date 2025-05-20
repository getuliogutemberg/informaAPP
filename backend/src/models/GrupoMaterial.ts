import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from "../database"; // ajuste o caminho conforme necessário

// Interface com todos os atributos
export interface IGrupoMaterialAttributes {
  id: string;
  cod_item_material: number;
  cod_grupo: number;
  data_grupo?: Date;
}

// Campos opcionais na criação
type IGrupoMaterialCreationAttributes = Optional<
  IGrupoMaterialAttributes,
  'id' | 'data_grupo'
>;

// Model Sequelize
class GrupoMaterial extends Model<IGrupoMaterialAttributes, IGrupoMaterialCreationAttributes>
  implements IGrupoMaterialAttributes {
  public id!: string;
  public cod_item_material!: number;
  public cod_grupo!: number;
  public data_grupo?: Date;
}

GrupoMaterial.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    cod_item_material: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cod_grupo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    data_grupo: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'GrupoMaterial',
    tableName: 'grupo_materials',
    schema: 'internal', // remova se não usar schemas
    timestamps: false,
    indexes: [
      { fields: ['cod_item_material'] },
      { fields: ['cod_grupo'] }
    ]
  }
);

export default GrupoMaterial;
