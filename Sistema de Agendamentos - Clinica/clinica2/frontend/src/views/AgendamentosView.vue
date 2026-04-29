<template>
  <div class="page">
    <div class="topo">
      <div>
        <h1>📅 Minhas Consultas</h1>
        <p>Olá, {{ auth.usuario?.nome }}</p>
      </div>
      <RouterLink to="/agendamentos/novo" class="btn btn-prim">+ Nova Consulta</RouterLink>
    </div>

    <div v-if="erro" class="alerta alerta-erro">{{ erro }}</div>
    <div v-if="carregando" class="vazio">Carregando...</div>

    <div v-else-if="agendamentos.length === 0" class="vazio card">
      <p>Nenhuma consulta encontrada.</p>
      <RouterLink to="/agendamentos/novo" class="btn btn-prim" style="margin-top:12px">Agendar consulta</RouterLink>
    </div>

    <div v-else class="lista">
      <div v-for="ag in agendamentos" :key="ag._id" class="card ag-card">
        <div class="ag-topo">
          <div>
            <strong>Dr(a). {{ ag.medico }}</strong>
            <span class="especialidade">{{ ag.especialidade }}</span>
          </div>
          <span :class="`badge badge-${ag.status}`">{{ ag.status }}</span>
        </div>
        <div class="ag-info">
          <span>📅 {{ formatarData(ag.dataHora) }}</span>
          <span>⏰ {{ formatarHora(ag.dataHora) }}</span>
          <span v-if="ag.cidade">📍 {{ ag.cidade }}</span>
        </div>
        <div v-if="ag.temChuva" class="alerta alerta-aviso">
          🌧️ Previsão de chuva no dia desta consulta!
        </div>
        <div v-if="ag.status === 'agendado' || ag.status === 'confirmado'" class="ag-acoes">
          <button class="btn btn-danger btn-sm" @click="cancelar(ag._id)">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const auth = useAuthStore()
const agendamentos = ref([])
const carregando = ref(false)
const erro = ref('')

const formatarData = dt => new Date(dt).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
const formatarHora = dt => new Date(dt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

async function buscar() {
  carregando.value = true
  try {
    const { data } = await api.get('/agendamentos')
    agendamentos.value = data.agendamentos
  } catch {
    erro.value = 'Erro ao carregar consultas.'
  } finally {
    carregando.value = false
  }
}

async function cancelar(id) {
  if (!confirm('Cancelar esta consulta?')) return
  try {
    await api.put(`/agendamentos/${id}/status`, { status: 'cancelado' })
    await buscar()
  } catch {
    erro.value = 'Erro ao cancelar.'
  }
}

onMounted(buscar)
</script>

<style scoped>
.topo { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
.topo h1 { font-size: 1.5rem; color: var(--verde); }
.topo p { color: var(--cinza); font-size: .9rem; }
.vazio { text-align: center; padding: 40px; color: var(--cinza); }
.lista { display: flex; flex-direction: column; gap: 14px; }
.ag-card { display: flex; flex-direction: column; gap: 10px; }
.ag-topo { display: flex; justify-content: space-between; align-items: flex-start; }
.ag-topo strong { display: block; font-size: 1rem; color: var(--verde-escuro); }
.especialidade { font-size: .82rem; color: var(--cinza); display: block; }
.ag-info { display: flex; flex-wrap: wrap; gap: 14px; font-size: .87rem; color: var(--cinza); }
.ag-acoes { padding-top: 10px; border-top: 1px solid var(--borda); }
</style>
