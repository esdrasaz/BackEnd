import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario'
import { autenticar, ReqAuth } from '../middleware/auth'

const router = Router()

router.post('/registro', async (req: Request, res: Response) => {
  const { nome, email, senha, perfil } = req.body
  if (!nome || !email || !senha) {
    res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' })
    return
  }
  try {
    const existe = await Usuario.findOne({ email })
    if (existe) {
      res.status(409).json({ erro: 'E-mail já cadastrado.' })
      return
    }
    const usuario = new Usuario({ nome, email, senha, perfil: perfil || 'paciente' })
    await usuario.save()
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', usuario })
  } catch {
    res.status(500).json({ erro: 'Erro ao registrar usuário.' })
  }
})

router.post('/login', async (req: Request, res: Response) => {
  const { email, senha } = req.body
  if (!email || !senha) {
    res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' })
    return
  }
  try {
    const usuario = await Usuario.findOne({ email })
    if (!usuario || !(await usuario.compararSenha(senha))) {
      res.status(401).json({ erro: 'E-mail ou senha incorretos.' })
      return
    }
    const token = jwt.sign(
      { id: usuario._id, nome: usuario.nome, perfil: usuario.perfil },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '8h' }
    )
    res.json({ token, usuario })
  } catch {
    res.status(500).json({ erro: 'Erro ao fazer login.' })
  }
})

router.get('/me', autenticar, async (req: ReqAuth, res: Response) => {
  const usuario = await Usuario.findById(req.usuario!.id)
  res.json({ usuario })
})

export default router
