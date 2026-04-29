import mongoose, { Document, Schema } from 'mongoose'

export interface IAgendamento extends Document {
  pacienteId: mongoose.Types.ObjectId
  nomePaciente: string
  medico: string
  especialidade: string
  dataHora: Date
  status: 'agendado' | 'confirmado' | 'cancelado'
  cep?: string
  cidade?: string
  temChuva?: boolean
}

const AgendamentoSchema = new Schema({
  pacienteId:   { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  nomePaciente: { type: String, required: true },
  medico:       { type: String, required: true },
  especialidade:{ type: String, required: true },
  dataHora:     { type: Date, required: true },
  status:       { type: String, enum: ['agendado', 'confirmado', 'cancelado'], default: 'agendado' },
  cep:          { type: String },
  cidade:       { type: String },
  temChuva:     { type: Boolean }
}, { timestamps: true })

export default mongoose.model<IAgendamento>('Agendamento', AgendamentoSchema)
