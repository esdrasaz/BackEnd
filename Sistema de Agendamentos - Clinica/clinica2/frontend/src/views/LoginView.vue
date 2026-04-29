<template>
  <div class="pagina-auth">
    <div class="card auth-card">
      <div class="auth-header">
        <span>🏥</span>
        <h1>ClínicaApp</h1>
        <p>Sistema de Agendamento Médico</p>
      </div>
      <div v-if="erro" class="alerta alerta-erro">{{ erro }}</div>
      <form @submit.prevent="handleLogin">
        <div class="campo">
          <label>E-mail</label>
          <input v-model="form.email" type="email" required placeholder="seu@email.com" />
        </div>
        <div class="campo">
          <label>Senha</label>
          <input v-model="form.senha" type="password" required placeholder="••••••••" />
        </div>
        <button type="submit" class="btn btn-prim" style="width:100%" :disabled="carregando">
          {{ carregando ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
      <p class="auth-link">Não tem conta? <RouterLink to="/registro">Cadastre-se</RouterLink></p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const erro = ref('')
const carregando = ref(false)
const form = reactive({ email: '', senha: '' })

async function handleLogin() {
  erro.value = ''
  carregando.value = true
  try {
    await auth.login(form.email, form.senha)
  } catch (e) {
    erro.value = e.response?.data?.erro || 'E-mail ou senha incorretos.'
  } finally {
    carregando.value = false
  }
}
</script>

<style scoped>
.pagina-auth {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #124d41, #1a6b5a, #2ec4b6);
  padding: 24px;
}
.auth-card { width: 100%; max-width: 400px; }
.auth-header { text-align: center; margin-bottom: 24px; }
.auth-header span { font-size: 2.5rem; }
.auth-header h1 { font-size: 1.6rem; color: var(--verde); margin: 4px 0; }
.auth-header p { color: var(--cinza); font-size: .9rem; }
.auth-link { text-align: center; margin-top: 16px; font-size: .88rem; color: var(--cinza); }
.auth-link a { color: var(--verde); font-weight: 600; }
</style>
