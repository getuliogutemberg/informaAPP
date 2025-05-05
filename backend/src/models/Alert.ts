import { Document, Schema, model } from 'mongoose';

// Interface que representa o documento Alert
export interface IAlert extends Document {
  type: string;
  title: string;
  description: string;
  color?: string; 
  icon?: string;  
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Schema do Mongoose com tipagem
const AlertSchema: Schema<IAlert> = new Schema({
  type: { 
    type: String, 
    required: [true, 'O tipo do alerta é obrigatório'],
    trim: true
  },
  title: { 
    type: String, 
    required: [true, 'O título do alerta é obrigatório'],
    trim: true,
    maxlength: [100, 'O título não pode ter mais que 100 caracteres']
  },
  description: { 
    type: String, 
    required: [true, 'A descrição do alerta é obrigatória'],
    trim: true
  },
  color: { 
    type: String,
    default: '#ffffff',
    match: [/^#([0-9a-f]{3}){1,2}$/i, 'Cor inválida']
  },
  icon: { 
    type: String,
    default: 'warning'
  },
  deletedAt: { 
    type: Date, 
    default: null
  }
}, { 
  timestamps: true 
});

const Alert = model<IAlert>('Alert', AlertSchema);

export default Alert;