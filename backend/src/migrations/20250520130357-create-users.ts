import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createSchema('internal').catch(() => {
    // ignora se já existir
  });

  await queryInterface.createTable(
    { schema: 'internal', tableName: 'users' },
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      RG: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      className: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      position: {
        type: DataTypes.ARRAY(DataTypes.FLOAT),
        allowNull: false,
        defaultValue: [0, 0],
      },
      customIcon: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:
          'https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Transparent.png',
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      jwtSecret: {
        type: DataTypes.STRING,
        allowNull: true,
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
  await queryInterface.dropTable({ schema: 'internal', tableName: 'users' });
  // opcional: await queryInterface.dropSchema('internal');
}
