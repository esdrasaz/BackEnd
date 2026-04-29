import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const usuario = ref(JSON.parse(localStorage.getItem('usuario') || 'null'))

  const estaLogado = computed(() => !!token.value)
  const ehSecretario = computed(() => usuario.value?.perfil === 'secretario')

  function salvar(t, u) {
    token.value = t
    usuario.value = u
    localStorage.setItem('token', t)
    localStorage.setItem('usuario', JSON.stringify(u))
  }

  async function login(email, senha) {
    const { data } = await api.post('/auth/login', { email, senha })
    salvar(data.token, data.usuario)
    router.push(data.usuario.perfil === 'secretario' ? '/painel' : '/agendamentos')
  }

  async function registrar(dados) {
    const { data } = await api.post('/auth/registro', dados)
    salvar(data.token || '', data.usuario)
    router.push('/agendamentos')
  }

  function logout() {
    token.value = null
    usuario.value = null
    localStorage.clear()
    router.push('/login')
  }

  return { token, usuario, estaLogado, ehSecretario, login, registrar, logout }
})
