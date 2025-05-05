import { Document, Schema, model } from 'mongoose';

// Interface que representa o documento EstrategiaParametros
export interface IEstrategiaParametros extends Document {
  cod_grupo: number;
  cod_item_material: number;
  client: string;
  cods_parametro: number[];
  cods_opcao: number[];
  data_estrategia: Date;
}

// Schema do Mongoose com tipagem
const EstrategiaParametrosSchema: Schema<IEstrategiaParametros> = new Schema({
  cod_grupo: { 
    type: Number, 
    required: [true, 'Código do grupo é obrigatório'],
    index: true
  },
  cod_item_material: { 
    type: Number, 
    required: [true, 'Código do item material é obrigatório'],
    index: true
  },
  client: { 
    type: String, 
    required: [true, 'Client é obrigatório'],
    trim: true,
    default: 'default'
  },
  cods_parametro: { 
    type: [Number], 
    required: [true, 'Códigos de parâmetro são obrigatórios'],
    validate: {
      validator: (array: number[]) => array.length > 0,
      message: 'Deve haver pelo menos um código de parâmetro'
    }
  },
  cods_opcao: { 
    type: [Number], 
    required: [true, 'Códigos de opção são obrigatórios'],
    validate: {
      validator: function(this: IEstrategiaParametros, array: number[]) {
        return array.length === this.cods_parametro.length;
      },
      message: 'Deve ter o mesmo número de códigos de opção que de parâmetros'
    }
  },
  data_estrategia: { 
    type: Date, 
    default: Date.now,
    index: true
  }
}, {
  collection: 'estrategia_parametros' // Mantendo o nome original da collection
});

const EstrategiaParametros = model<IEstrategiaParametros>('EstrategiaParametros', EstrategiaParametrosSchema);

export default EstrategiaParametros;