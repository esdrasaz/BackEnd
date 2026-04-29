<template>
  <div class="page">
    <h1 style="color:var(--verde);margin-bottom:24px">📊 Painel Administrativo</h1>

    <div v-if="erro" class="alerta alerta-erro">{{ erro }}</div>
    <div v-if="carregando" class="vazio">Carregando...</div>

    <div v-else>
      <div class="stats">
        <div class="stat-card"><span>{{ total }}</span><p>Total</p></div>
        <div class="stat-card verde"><span>{{ agendados }}</span><p>Agendados</p></div>
        <div class="stat-card vermelho"><span>{{ cancelados }}</span><p>Cancelados</p></div>
      </div>

      <div class="card" style="padding:0;overflow:hidden;margin-top:20px">
        <table class="tabela">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Data / Hora</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="agendamentos.length === 0">
              <td colspan="5" style="text-align:center;padding:24px;color:var(--cinza)">Nenhum agendamento.</td>
            </tr>
            <tr v-for="ag in agendamentos" :key="ag._id">
              <td>{{ ag.nomePaciente }}</td>
              <td>
                <strong>Dr(a). {{ ag.medico }}</strong><br>
                <small>{{ ag.especialidade }}</small>
              </td>
              <td>
                {{ formatarData(ag.dataHora) }}<br>
                <small>{{ formatarHora(ag.dataHora) }}</small>
                <span v-if="ag.temChuva" title="Previsão de chuva"> 🌧️</span>
              </td>
              <td><span :class="`badge badge-${ag.status}`">{{ ag.status }}</span></td>
              <td>
                <div style="display:flex;gap:4px;flex-wrap:wrap">
                  <button v-if="ag.status === 'agendado'" class="btn btn-sm" style="background:#e8f5e9;color:#2e7d32;border:none" @click="atualizar(ag._id, 'confirmado')">Confirmar</button>
                  <button v-if="ag.status !== 'cancelado'" class="btn btn-danger btn-sm" @click="atualizar(ag._id, 'cancelado')">Cancelar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'

const agendamentos = ref([])
const carregando = ref(false)
const erro = ref('')

const total      = computed(() => agendamentos.value.length)
const agendados  = computed(() => agendamentos.value.filter(a => a.status === 'agendado' || a.status === 'confirmado').length)
const cancelados = computed(() => agendamentos.value.filter(a => a.status === 'cancelado').length)

const formatarData = dt => new Date(dt).toLocaleDateString('pt-BR')
const formatarHora = dt => new Date(dt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

async function buscar() {
  carregando.value = true
  try {
    const { data } = await api.get('/agendamentos')
    agendamentos.value = data.agendamentos
  } catch {
    erro.value = 'Erro ao carregar agendamentos.'
  } finally {
    carregando.value = false
  }
}

async function atualizar(id, status) {
  try {
    await api.put(`/agendamentos/${id}/status`, { status })
    await buscar()
  } catch {
    erro.value = 'Erro ao atualizar status.'
  }
}

onMounted(buscar)
</script>

<style scoped>
.vazio { text-align: center; padding: 40px; color: var(--cinza); }
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.stat-card {
  background: var(--branco); border-radius: 10px; padding: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,.07); text-align: center;
  border-left: 4px solid var(--verde);
}
.stat-card.verde  { border-left-color: #2e7d32; }
.stat-card.vermelho { border-left-color: #c62828; }
.stat-card span { font-size: 2rem; font-weight: 700; color: var(--texto); display: block; }
.stat-card p { font-size: .8rem; color: var(--cinza); margin-top: 2px; }
.tabela { width: 100%; border-collapse: collapse; font-size: .88rem; }
.tabela th { background: #f0faf5; color: var(--verde-escuro); padding: 10px 14px; text-align: left; border-bottom: 2px solid var(--borda); }
.tabela td { padding: 10px 14px; border-bottom: 1px solid var(--borda); vertical-align: middle; }
.tabela tr:last-child td { border-bottom: none; }
.tabela tr:hover td { background: #f8fbfa; }
.tabela small { color: var(--cinza); font-size: .78rem; }
@media (max-width: 600px) { .stats { grid-template-columns: 1fr 1fr; } }
</style>
