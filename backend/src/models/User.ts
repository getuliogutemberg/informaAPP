import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import sequelize from "../database"; // Ajuste o caminho conforme necessário

// Atributos completos da entidade
export interface IUserAttributes {
  id: string;
  name: string;
  email: string;
  RG?: string;
  password: string;
  category: string;
  className: string;
  refreshToken: string | null; // permite null
  position: [number, number];
  customIcon: string;
  status: string;
  isActive: boolean;
  jwtSecret?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Campos opcionais na criação
type IUserCreationAttributes = Optional<
  IUserAttributes,
  'id' | 'RG' | 'refreshToken' | 'jwtSecret' | 'status' | 'customIcon' | 'createdAt' | 'updatedAt'
>;

// Classe User
class User extends Model<IUserAttributes, IUserCreationAttributes> implements IUserAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public RG?: string;
  public password!: string;
  public category!: string;
  public className!: string;
  public refreshToken!: string;
  public position!: [number, number];
  public customIcon!: string;
  public status!: string;
  public isActive!: boolean;
  public jwtSecret?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    RG: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    className: {
      type: DataTypes.STRING,
      allowNull: false
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,   // Permite null
    },
    position: {
      type: DataTypes.ARRAY(DataTypes.FLOAT), // FLOAT para números decimais
      defaultValue: [0, 0]
    },
    customIcon: {
      type: DataTypes.STRING,
      defaultValue: 'https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Transparent.png'
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    jwtSecret: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    schema: 'internal',
    timestamps: true
  }
);

export default User;
