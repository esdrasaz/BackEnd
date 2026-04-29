<template>
  <div class="page">
    <div class="topo">
      <RouterLink to="/agendamentos" class="btn btn-sec btn-sm">← Voltar</RouterLink>
      <h1>📋 Nova Consulta</h1>
    </div>

    <div v-if="erro" class="alerta alerta-erro">{{ erro }}</div>
    <div v-if="sucesso" class="alerta alerta-ok">{{ sucesso }}</div>
    <div v-if="alertaChuva" class="alerta alerta-aviso">{{ alertaChuva }}</div>

    <form @submit.prevent="agendar" class="card form">
      <h3>Dados da Consulta</h3>
      <div class="grid2">
        <div class="campo">
          <label>Médico *</label>
          <select v-model="form.medico" required @change="preencherEspecialidade">
            <option value="">Selecione</option>
            <option v-for="m in medicos" :key="m.nome" :value="m.nome">Dr(a). {{ m.nome }}</option>
          </select>
        </div>
        <div class="campo">
          <label>Especialidade *</label>
          <input v-model="form.especialidade" type="text" required readonly placeholder="Preenchida automaticamente" />
        </div>
      </div>
      <div class="grid2">
        <div class="campo">
          <label>Data *</label>
          <input v-model="form.data" type="date" :min="amanha" required @change="buscarClima" />
        </div>
        <div class="campo">
          <label>Horário *</label>
          <input v-model="form.hora" type="time" required />
        </div>
      </div>

      <hr style="border:none;border-top:1px solid var(--borda);margin:8px 0 16px" />
      <h3>Endereço</h3>

      <div class="campo">
        <label>CEP</label>
        <div style="display:flex;gap:8px">
          <input v-model="form.cep" type="text" placeholder="00000-000" maxlength="9" @input="mascaraCep" style="flex:1" />
          <button type="button" class="btn btn-sec btn-sm" @click="buscarCep" :disabled="buscandoCep">
            {{ buscandoCep ? '...' : 'Buscar' }}
          </button>
        </div>
        <span v-if="erroCep" style="font-size:.8rem;color:#c62828">{{ erroCep }}</span>
      </div>

      <div class="grid2">
        <div class="campo">
          <label>Logradouro</label>
          <input v-model="form.logradouro" type="text" />
        </div>
        <div class="campo">
          <label>Número</label>
          <input v-model="form.numero" type="text" />
        </div>
      </div>
      <div class="grid2">
        <div class="campo">
          <label>Cidade</label>
          <input v-model="form.cidade" type="text" @change="buscarClima" />
        </div>
        <div class="campo">
          <label>Estado</label>
          <input v-model="form.estado" type="text" maxlength="2" />
        </div>
      </div>

      <div v-if="clima" class="clima-box">
        <span style="font-size:1.5rem">{{ clima.temChuva ? '🌧️' : '☀️' }}</span>
        <div>
          <strong>{{ clima.temperatura }}°C — {{ clima.descricao }}</strong>
          <span>📍 {{ clima.cidade }}</span>
        </div>
      </div>

      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
        <RouterLink to="/agendamentos" class="btn btn-sec">Cancelar</RouterLink>
        <button type="submit" class="btn btn-prim" :disabled="enviando">
          {{ enviando ? 'Agendando...' : '✅ Confirmar' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const enviando = ref(false)
const buscandoCep = ref(false)
const erro = ref('')
const sucesso = ref('')
const erroCep = ref('')
const alertaChuva = ref('')
const clima = ref(null)

const amanha = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
})

const medicos = [
  { nome: 'Ana Silva',      especialidade: 'Cardiologia' },
  { nome: 'Carlos Souza',   especialidade: 'Clínica Geral' },
  { nome: 'Mariana Costa',  especialidade: 'Pediatria' },
  { nome: 'Roberto Lima',   especialidade: 'Ortopedia' },
  { nome: 'Fernanda Ramos', especialidade: 'Dermatologia' }
]

const form = reactive({
  medico: '', especialidade: '', data: '', hora: '08:00',
  cep: '', logradouro: '', numero: '', cidade: '', estado: ''
})

function preencherEspecialidade() {
  const m = medicos.find(m => m.nome === form.medico)
  form.especialidade = m?.especialidade || ''
}

function mascaraCep() {
  form.cep = form.cep.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9)
}

async function buscarCep() {
  erroCep.value = ''
  const cep = form.cep.replace(/\D/g, '')
  if (cep.length !== 8) { erroCep.value = 'Digite um CEP válido.'; return }
  buscandoCep.value = true
  try {
    const { data } = await api.get(`/cep/${cep}`)
    form.logradouro = data.logradouro
    form.cidade = data.cidade
    form.estado = data.estado
    if (form.data) buscarClima()
  } catch (e) {
    erroCep.value = e.response?.data?.erro || 'CEP não encontrado.'
  } finally {
    buscandoCep.value = false
  }
}

async function buscarClima() {
  if (!form.cidade) return
  try {
    const { data } = await api.get(`/clima/${encodeURIComponent(form.cidade)}`)
    clima.value = data
    alertaChuva.value = data.temChuva ? `⚠️ Previsão de chuva em ${data.cidade} no dia da consulta!` : ''
  } catch {
    clima.value = null
  }
}

async function agendar() {
  erro.value = ''
  sucesso.value = ''
  enviando.value = true
  try {
    const dataHora = new Date(`${form.data}T${form.hora}:00`).toISOString()
    const { data } = await api.post('/agendamentos', {
      medico: form.medico,
      especialidade: form.especialidade,
      dataHora,
      cep: form.cep || undefined,
      cidade: form.cidade || undefined
    })
    sucesso.value = data.mensagem
    if (data.alertaChuva) alertaChuva.value = data.alertaChuva
    setTimeout(() => router.push('/agendamentos'), 2000)
  } catch (e) {
    erro.value = e.response?.data?.erro || 'Erro ao agendar.'
  } finally {
    enviando.value = false
  }
}
</script>

<style scoped>
.topo { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; flex-wrap: wrap; }
.topo h1 { font-size: 1.5rem; color: var(--verde); }
.form { display: flex; flex-direction: column; gap: 0; }
.form h3 { font-size: 1rem; color: var(--verde); margin-bottom: 14px; }
.clima-box {
  display: flex; align-items: center; gap: 12px;
  background: linear-gradient(135deg, #e8f5f1, #d0ede6);
  border-radius: 8px; padding: 14px; margin-top: 4px;
}
.clima-box strong { display: block; color: var(--verde-escuro); }
.clima-box span { font-size: .82rem; color: var(--cinza); }
</style>
