import { Document, Schema, model } from 'mongoose';

// Interface que representa o documento CadastroMaterial
export interface ICadastroMaterial extends Document {
  cod_item_material: number;
  cod_itemmaterial_ext?: number; // Opcional
  desc_material: string;
  desc_numero_itemmaterial?: number; // Opcional
  cod_unidade_medida: string;
  cod_classematerial: number;
  cod_grupo: number;
}

// Schema do Mongoose com tipagem
const CadastroMaterialSchema: Schema<ICadastroMaterial> = new Schema({
  cod_item_material: { 
    type: Number, 
    required: [true, 'Código do item material é obrigatório'],
    unique: true,
    index: true
  },
  cod_itemmaterial_ext: { 
    type: Number,
    index: true
  },
  desc_material: { 
    type: String, 
    required: [true, 'Descrição do material é obrigatória'],
    trim: true,
    maxlength: [200, 'Descrição não pode exceder 200 caracteres']
  },
  desc_numero_itemmaterial: { 
    type: Number 
  },
  cod_unidade_medida: { 
    type: String, 
    required: [true, 'Código da unidade de medida é obrigatório'],
    trim: true,
    uppercase: true,
    maxlength: [10, 'Código da unidade não pode exceder 10 caracteres']
  },
  cod_classematerial: { 
    type: Number, 
    required: [true, 'Código da classe de material é obrigatório'],
    index: true
  },
  cod_grupo: { 
    type: Number, 
    required: [true, 'Código do grupo é obrigatório'],
    index: true
  }
}, {
  collection: 'cadastro_materials'
});

const CadastroMaterial = model<ICadastroMaterial>('CadastroMaterial', CadastroMaterialSchema);

export default CadastroMaterial;
 