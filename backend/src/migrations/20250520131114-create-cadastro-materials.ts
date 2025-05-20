import { DataTypes, QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('cadastro_materials', {
    cod_item_material: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    cod_itemmaterial_ext: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    desc_material: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    desc_numero_itemmaterial: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cod_unidade_medida: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    cod_classematerial: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cod_grupo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('cadastro_materials');
}
