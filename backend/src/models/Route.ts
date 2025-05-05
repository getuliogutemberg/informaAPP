import { Document, Schema, model, Model } from 'mongoose';

// Interface que representa o documento Route
export interface IRoute extends Document {
  path: string;
  component: string;
  name: string;
  requiredRole: string[];
  pageId?: string;
  reportId?: string;
  workspaceId?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema do Mongoose com tipagem
const RouteSchema: Schema<IRoute> = new Schema({
  path: { 
    type: String, 
    required: [true, 'O caminho da rota é obrigatório'],
    unique: true 
  },
  component: { 
    type: String, 
    required: [true, 'O componente da rota é obrigatório'] 
  },
  name: { 
    type: String, 
    required: [true, 'O nome da rota é obrigatório'] 
  },
  requiredRole: { 
    type: [String], 
    default: [],
    validate: {
      validator: (roles: string[]) => roles.every(role => typeof role === 'string'),
      message: 'Todos os roles devem ser strings'
    }
  },
  pageId: { 
    type: String,
    required: false
  },
  reportId: { 
    type: String,
    required: false 
  },
  workspaceId: { 
    type: String,
    required: false 
  },
  icon: { 
    type: String,
    required: false 
  }
}, { 
  timestamps: true 
});

const Route: Model<IRoute> = model<IRoute>('Route', RouteSchema);

export default Route;