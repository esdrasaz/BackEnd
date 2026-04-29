import { Router, Response } from 'express'
import axios from 'axios'
import { autenticar, ReqAuth } from '../middleware/auth'
import Agendamento from '../models/Agendamento'

const router = Router()
router.use(autenticar)

router.get('/', async (req: ReqAuth, res: Response) => {
  const filtro = req.usuario!.perfil === 'paciente'
    ? { pacienteId: req.usuario!.id }
    : {}
  const agendamentos = await Agendamento.find(filtro).sort({ dataHora: 1 })
  res.json({ agendamentos })
})

router.post('/', async (req: ReqAuth, res: Response) => {
  const { medico, especialidade, dataHora, cep, cidade } = req.body
  if (!medico || !especialidade || !dataHora) {
    res.status(400).json({ erro: 'Médico, especialidade e data são obrigatórios.' })
    return
  }

  const data = new Date(dataHora)

  const conflito = await Agendamento.findOne({
    medico,
    dataHora: data,
    status: { $ne: 'cancelado' }
  })
  if (conflito) {
    res.status(409).json({ erro: 'Médico já tem consulta neste horário.' })
    return
  }

  let temChuva = false
  if (cidade) {
    try {
      const { data: clima } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: { q: `${cidade},BR`, appid: process.env.OPENWEATHER_API_KEY, units: 'metric' },
        timeout: 4000
      })
      const id = clima.weather[0].id
      temChuva = id >= 200 && id < 700
    } catch {
      temChuva = false
    }
  }

  const agendamento = new Agendamento({
    pacienteId: req.usuario!.id,
    nomePaciente: req.usuario!.nome,
    medico,
    especialidade,
    dataHora: data,
    cep,
    cidade,
    temChuva
  })
  await agendamento.save()

  res.status(201).json({
    mensagem: 'Consulta agendada!',
    agendamento,
    alertaChuva: temChuva ? '⚠️ Previsão de chuva no dia da consulta!' : null
  })
})

router.put('/:id/status', async (req: ReqAuth, res: Response) => {
  const { status } = req.body
  const agendamento = await Agendamento.findById(req.params.id)
  if (!agendamento) {
    res.status(404).json({ erro: 'Agendamento não encontrado.' })
    return
  }
  if (req.usuario!.perfil === 'paciente' && agendamento.pacienteId.toString() !== req.usuario!.id) {
    res.status(403).json({ erro: 'Sem permissão.' })
    return
  }
  agendamento.status = status
  await agendamento.save()
  res.json({ mensagem: 'Status atualizado.', agendamento })
})

export default router
