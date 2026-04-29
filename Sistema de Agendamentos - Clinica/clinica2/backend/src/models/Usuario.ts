import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUsuario extends Document {
  nome: string
  email: string
  senha: string
  perfil: 'paciente' | 'secretario'
  compararSenha(senha: string): Promise<boolean>
}

const UsuarioSchema = new Schema({
  nome:   { type: String, required: true },
  email:  { type: String, required: true, unique: true },
  senha:  { type: String, required: true },
  perfil: { type: String, enum: ['paciente', 'secretario'], default: 'paciente' }
})

UsuarioSchema.pre<IUsuario>('save', async function (next) {
  if (!this.isModified('senha')) return next()
  this.senha = await bcrypt.hash(this.senha, 10)
  next()
})

UsuarioSchema.methods.compararSenha = function (senha: string) {
  return bcrypt.compare(senha, this.senha)
}

UsuarioSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.senha
  return obj
}

export default mongoose.model<IUsuario>('Usuario', UsuarioSchema)
