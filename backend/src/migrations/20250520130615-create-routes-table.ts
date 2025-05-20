import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createSchema('internal').catch(() => {
    // ignora se já existir
  });

  await queryInterface.createTable(
    { schema: 'internal', tableName: 'routes' },
    {
      id: {
        type: DataTypes.STRING,
        allowNull: true,  // conforme model
        primaryKey: false, // não é PK
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      component: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      requiredRole: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      pageId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      reportId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      workspaceId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    }
  );
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable({ schema: 'internal', tableName: 'routes' });
}
