
import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

interface Matricula {
  nome: string
  email: string
  curso: string
}

const cursos = [
  { id: 1, nome: "JavaScript Básico" },
  { id: 2, nome: "Vue.js para Iniciantes" },
  { id: 3, nome: "Node.js e Express" }
]

const matriculas: Matricula[] = []

app.get('/cursos', (req: Request, res: Response) => {
  res.json(cursos)
})

app.post('/matricula', (req: Request, res: Response) => {
  const { nome, email, curso } = req.body as Matricula

  if (!nome || !email || !curso) {
    res.status(400).json({ erro: "Dados inválidos" })
    return
  }

  matriculas.push({ nome, email, curso })

  res.status(201).json({ mensagem: "Matrícula criada" })
})

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000")
})
