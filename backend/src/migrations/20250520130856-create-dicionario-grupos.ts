import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable(
    { tableName: 'dicionario_grupos', schema: 'internal' },
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      cod_grupo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      desc_grupo: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    }
  );

  await queryInterface.addIndex(
    { tableName: 'dicionario_grupos', schema: 'internal' },
    {
      fields: ['cod_grupo'],
    }
  );
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable({ tableName: 'dicionario_grupos', schema: 'internal' });
}
