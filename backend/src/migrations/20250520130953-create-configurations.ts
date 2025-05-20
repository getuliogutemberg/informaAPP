import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable(
    { tableName: 'configurations', schema: 'internal' },
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      notifications: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      allowRegister: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      allowRequireRegister: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      allowNewCategory: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      allowNewClassName: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      addSecretKey: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      addCategory: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      fontFamily: {
        type: DataTypes.STRING,
        defaultValue: 'Arial',
        allowNull: false,
      },
      pageTitle: {
        type: DataTypes.STRING,
        defaultValue: 'Configurações',
        allowNull: false,
      },
      themeMode: {
        type: DataTypes.ENUM('light', 'dark'),
        defaultValue: 'light',
        allowNull: false,
      },
      primaryColor: {
        type: DataTypes.INTEGER,
        defaultValue: 56,
        allowNull: false,
      },
      secondaryColor: {
        type: DataTypes.INTEGER,
        defaultValue: 180,
        allowNull: false,
      },
      backgroundColor: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      textColor: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      pbiKeys: {
        type: DataTypes.JSONB,
        defaultValue: {
          clientId: 'b918d10b-19f4-44c3-a58e-36e311e734ce',
          clientSecret: 'dmZ8Q~Nmgk-9wiaO2Wxe6qRc8TZI.MZ8ob3psaP5',
          authority: 'https://login.microsoftonline.com/80899d73-a5f2-4a53-b252-077af6003b36',
        },
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    }
  );
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable({ tableName: 'configurations', schema: 'internal' });
}
