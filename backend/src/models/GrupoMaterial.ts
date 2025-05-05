import { Document, Schema, model } from 'mongoose';

// Interface que representa o documento GrupoMaterial
export interface IGrupoMaterial extends Document {
  cod_item_material: number;
  cod_grupo: number;
  data_grupo?: Date;
}

// Schema do Mongoose com tipagem
const GrupoMaterialSchema: Schema<IGrupoMaterial> = new Schema({
  cod_item_material: { 
    type: Number, 
    required: [true, 'Código do item material é obrigatório'],
    index: true
  },
  cod_grupo: { 
    type: Number, 
    required: [true, 'Código do grupo é obrigatório'],
    index: true
  },
  data_grupo: { 
    type: Date, 
    default: Date.now
  }
}, {
  collection: 'grupo_materials',
  timestamps: false
});

const GrupoMaterial = model<IGrupoMaterial>('GrupoMaterial', GrupoMaterialSchema);

export default GrupoMaterial;