import { Router, Request, Response } from 'express'
import axios from 'axios'
import { autenticar } from '../middleware/auth'

const router = Router()
router.use(autenticar)

router.get('/cep/:cep', async (req: Request, res: Response) => {
  const cep = req.params.cep.replace(/\D/g, '')
  if (cep.length !== 8) {
    res.status(400).json({ erro: 'CEP inválido.' })
    return
  }
  try {
    const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`, { timeout: 5000 })
    if (data.erro) {
      res.status(404).json({ erro: 'CEP não encontrado.' })
      return
    }
    res.json({
      cep: data.cep,
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf
    })
  } catch {
    res.status(500).json({ erro: 'Erro ao consultar CEP.' })
  }
})

router.get('/clima/:cidade', async (req: Request, res: Response) => {
  try {
    const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: `${req.params.cidade},BR`,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric',
        lang: 'pt_br'
      },
      timeout: 5000
    })
    const id = data.weather[0].id
    res.json({
      cidade: data.name,
      temperatura: Math.round(data.main.temp),
      descricao: data.weather[0].description,
      temChuva: id >= 200 && id < 700
    })
  } catch {
    res.status(500).json({ erro: 'Erro ao consultar clima.' })
  }
})

export default router
