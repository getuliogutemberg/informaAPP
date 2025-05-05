import { Document, Schema, model } from 'mongoose';

// Interface que representa o documento DicionarioGrupo
export interface IDicionarioGrupo extends Document {
  cod_grupo: number;
  desc_grupo: string;
}

// Schema do Mongoose com tipagem
const DicionarioGrupoSchema: Schema<IDicionarioGrupo> = new Schema({
  cod_grupo: { 
    type: Number, 
    required: [true, 'Código do grupo é obrigatório'],
    unique: true,
    index: true
  },
  desc_grupo: { 
    type: String, 
    required: [true, 'Descrição do grupo é obrigatória'],
    trim: true,
    maxlength: [100, 'Descrição não pode exceder 100 caracteres']
  }
}, {
  collection: 'dicionario_grupos' // Mantendo o nome da collection original
});

// Model TypeScript
const DicionarioGrupo = model<IDicionarioGrupo>('DicionarioGrupo', DicionarioGrupoSchema);

export default DicionarioGrupo;