import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface para representar o documento User
export interface IUser extends Document {
  name: string;
  email: string;
  RG?: string;
  password: string;
  category: string;
  className: string;
  refreshToken?: string;
  position: [number, number];
  customIcon: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  isActive: boolean;
}

// Schema do usuário
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  RG: { type: String },
  password: { type: String, required: true },
  category: { type: String, required: true },
  className: { type: String, required: true },
  refreshToken: { type: String },
  position: { type: [Number], default: [0, 0] },
  customIcon: { 
    type: String, 
    default: 'https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Transparent.png' 
  },
  status: { type: String, default: '' },
  isActive: { type: Boolean, default: false }
}, { 
  timestamps: true 
});

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;