import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable(
    { tableName: 'estrategia_parametros', schema: 'internal' },
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
      },
      cod_item_material: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      client: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'default',
      },
      cods_parametro: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
      },
      cods_opcao: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
      },
      data_estrategia: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    }
  );

  // Índices
  await queryInterface.addIndex(
    { tableName: 'estrategia_parametros', schema: 'internal' },
    {
      fields: ['cod_grupo'],
    }
  );

  await queryInterface.addIndex(
    { tableName: 'estrategia_parametros', schema: 'internal' },
    {
      fields: ['cod_item_material'],
    }
  );

  await queryInterface.addIndex(
    { tableName: 'estrategia_parametros', schema: 'internal' },
    {
      fields: ['data_estrategia'],
    }
  );
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable({ tableName: 'estrategia_parametros', schema: 'internal' });
}
