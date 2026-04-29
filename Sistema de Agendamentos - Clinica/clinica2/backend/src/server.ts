import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import authRoutes from './routes/auth'
import agendamentosRoutes from './routes/agendamentos'
import integracoesRoutes from './routes/integracoes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/agendamentos', agendamentosRoutes)
app.use('/api', integracoesRoutes)

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clinica_db')
  .then(() => {
    console.log('Conectado ao MongoDB')
    app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`))
  })
  .catch(err => { console.error('Erro ao conectar:', err); process.exit(1) })
