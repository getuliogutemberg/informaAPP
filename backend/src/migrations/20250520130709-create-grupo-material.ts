import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createSchema('internal').catch(() => {
    // ignora se já existir
  });

  await queryInterface.createTable(
    { schema: 'internal', tableName: 'grupo_materials' },
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      cod_item_material: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cod_grupo: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      data_grupo: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    }
  );

  // Índices
  await queryInterface.addIndex(
    { schema: 'internal', tableName: 'grupo_materials' },
    ['cod_item_material']
  );
  await queryInterface.addIndex(
    { schema: 'internal', tableName: 'grupo_materials' },
    ['cod_grupo']
  );
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable({ schema: 'internal', tableName: 'grupo_materials' });
}
