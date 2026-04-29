import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface ReqAuth extends Request {
  usuario?: { id: string; nome: string; perfil: string }
}

export function autenticar(req: ReqAuth, res: Response, next: NextFunction): void {
  const token = req.headers['authorization']?.split(' ')[1]
  if (!token) {
    res.status(401).json({ erro: 'Token não fornecido.' })
    return
  }
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) {
      res.status(403).json({ erro: 'Token inválido ou expirado.' })
      return
    }
    req.usuario = decoded as { id: string; nome: string; perfil: string }
    next()
  })
}
