import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from 'sequelize';

// Atributos do modelo
export interface IAlertAttributes {
  id: number;
  type: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Atributos opcionais na criação
export interface IAlertCreationAttributes
  extends Optional<IAlertAttributes, 'id' | 'color' | 'icon' | 'deletedAt' | 'createdAt' | 'updatedAt'> {}

// Modelo Sequelize
export class Alert
  extends Model<IAlertAttributes, IAlertCreationAttributes>
  implements IAlertAttributes
{
  public id!: number;
  public type!: string;
  public title!: string;
  public description!: string;
  public color?: string;
  public icon?: string;
  public deletedAt?: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Função de inicialização do modelo
export function initAlert(sequelize: Sequelize): void {
  Alert.init(
    {      
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'O tipo do alerta é obrigatório' }
        }
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'O título do alerta é obrigatório' },
          len: {
            args: [1, 100],
            msg: 'O título não pode ter mais que 100 caracteres'
          }
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'A descrição do alerta é obrigatória' }
        }
      },
      color: {
        type: DataTypes.STRING,
        defaultValue: '#ffffff',
        validate: {
          is: {
            args: /^#([0-9a-f]{3}){1,2}$/i,
            msg: 'Cor inválida'
          }
        }
      },
      icon: {
        type: DataTypes.STRING,
        defaultValue: 'warning'
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'alerts',
      timestamps: true,
      paranoid: true // ativa soft delete usando deletedAt
    }
  );
}
