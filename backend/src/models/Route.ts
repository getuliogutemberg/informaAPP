import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import sequelize from "../database"; // Adjust path if necessary




// Define an interface for the model attributes including timestamps
export interface IRouteAttributes {
  id: string;
  path: string;
  component: string;
  name: string;
  requiredRole: string[];
  pageId?: string;
  reportId?: string;
  workspaceId?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define os campos opcionais na criação
type IRouteCreationAttributes = Optional<
  IRouteAttributes,
   'pageId' | 'reportId' | 'workspaceId' | 'icon' | 'createdAt' | 'updatedAt'
>;

class Route extends Model<IRouteAttributes, IRouteCreationAttributes> implements IRouteAttributes {
  public id!: string;
  public path!: string;
  public component!: string;
  public name!: string;
  public requiredRole!: string[];
  public pageId?: string;
  public reportId?: string;
  public workspaceId?: string;
  public icon?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Route.init(
  {
    id: {
      type: DataTypes.UUID,  // ou outro tipo que estiver usando
      primaryKey: true,      // <<-- ESSENCIAL
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Added unique constraint based on Mongoose schema
    },
    component: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    requiredRole: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    pageId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reportId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    workspaceId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: 'Route',
    tableName: 'routes',
    schema: 'internal',
    timestamps: true,
  }
);

export default Route;