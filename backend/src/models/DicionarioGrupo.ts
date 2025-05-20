import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from "../database"; // ajuste se necessário

// Interface com os atributos
export interface IDicionarioGrupoAttributes {
  id: string;
  cod_grupo: number;
  desc_grupo: string;
}

// Campos opcionais na criação
type IDicionarioGrupoCreationAttributes = Optional<IDicionarioGrupoAttributes, 'id'>;

// Definição do model
class DicionarioGrupo extends Model<IDicionarioGrupoAttributes, IDicionarioGrupoCreationAttributes>
  implements IDicionarioGrupoAttributes {
  public id!: string;
  public cod_grupo!: number;
  public desc_grupo!: string;
}

DicionarioGrupo.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    cod_grupo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    desc_grupo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: {
          args: [0, 100],
          msg: 'Descrição não pode exceder 100 caracteres'
        }
      }
    }
  },
  {
    sequelize,
    modelName: 'DicionarioGrupo',
    tableName: 'dicionario_grupos',
    schema: 'internal', // remova se não estiver usando schemas
    timestamps: false,
    indexes: [{ fields: ['cod_grupo'] }]
  }
);

export default DicionarioGrupo;
