
<template>
  <div class="pagina">
    <div class="card">
      <h1>Matrícula em Curso</h1>

      <p v-if="erroCarregamento" class="mensagem erro">{{ erroCarregamento }}</p>

      <form @submit.prevent="enviar" novalidate>

        <div class="campo">
          <label for="nome">Nome completo</label>
          <input
            id="nome"
            v-model="nome"
            type="text"
            placeholder="Digite seu nome completo"
            @blur="validarNome"
            :class="{ invalido: erros.nome }"
          />
          <span v-if="erros.nome" class="erro-campo">{{ erros.nome }}</span>
        </div>

        <div class="campo">
          <label for="email">E-mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Digite seu e-mail"
            @blur="validarEmail"
            :class="{ invalido: erros.email }"
          />
          <span v-if="erros.email" class="erro-campo">{{ erros.email }}</span>
        </div>

        <div class="campo">
          <label for="curso">Curso</label>
          <select
            id="curso"
            v-model="curso"
            @blur="validarCurso"
            :class="{ invalido: erros.curso }"
          >
            <option value="">Selecione um curso</option>
            <option v-for="c in cursos" :key="c.id" :value="c.nome">
              {{ c.nome }}
            </option>
          </select>
          <span v-if="erros.curso" class="erro-campo">{{ erros.curso }}</span>
        </div>

        <button type="submit" :disabled="enviando">
          <span v-if="enviando">Enviando...</span>
          <span v-else>Matricular</span>
        </button>

      </form>

      <p v-if="mensagemSucesso" class="mensagem sucesso">{{ mensagemSucesso }}</p>
      <p v-if="mensagemErro" class="mensagem erro">{{ mensagemErro }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Curso {
  id: number
  nome: string
}

interface Erros {
  nome: string
  email: string
  curso: string
}

const nome = ref('')
const email = ref('')
const curso = ref('')
const cursos = ref<Curso[]>([])
const enviando = ref(false)
const mensagemSucesso = ref('')
const mensagemErro = ref('')
const erroCarregamento = ref('')

const erros = ref<Erros>({ nome: '', email: '', curso: '' })

function validarNome() {
  erros.value.nome = nome.value.trim().length < 3
    ? 'Informe seu nome completo (mínimo 3 caracteres).'
    : ''
}

function validarEmail() {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  erros.value.email = !regex.test(email.value)
    ? 'Informe um e-mail válido.'
    : ''
}

function validarCurso() {
  erros.value.curso = !curso.value
    ? 'Selecione um curso.'
    : ''
}

function formularioValido(): boolean {
  validarNome()
  validarEmail()
  validarCurso()
  return !erros.value.nome && !erros.value.email && !erros.value.curso
}

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/cursos')
    cursos.value = await res.json()
  } catch {
    erroCarregamento.value = 'Não foi possível carregar os cursos. Verifique se o servidor está rodando.'
  }
})

async function enviar() {
  mensagemSucesso.value = ''
  mensagemErro.value = ''

  if (!formularioValido()) return

  enviando.value = true

  try {
    const res = await fetch('http://localhost:3000/matricula', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: nome.value.trim(),
        email: email.value.trim(),
        curso: curso.value
      })
    })

    if (res.status === 201) {
      mensagemSucesso.value = 'Matrícula realizada com sucesso!'
      nome.value = ''
      email.value = ''
      curso.value = ''
      erros.value = { nome: '', email: '', curso: '' }
    } else {
      const dados = await res.json()
      mensagemErro.value = dados.erro || 'Erro ao realizar matrícula.'
    }
  } catch {
    mensagemErro.value = 'Erro de conexão com o servidor.'
  } finally {
    enviando.value = false
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f0f2f5;
  min-height: 100vh;
}

.pagina {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.card {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 480px;
}

h1 {
  font-size: 1.5rem;
  color: #1a1a2e;
  margin-bottom: 24px;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
}

input,
select {
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  width: 100%;
  transition: border-color 0.2s;
}

input:focus,
select:focus {
  outline: none;
  border-color: #4f46e5;
}

input.invalido,
select.invalido {
  border-color: #e53e3e;
}

.erro-campo {
  font-size: 0.8rem;
  color: #e53e3e;
}

button {
  padding: 12px;
  background-color: #4f46e5;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;
  margin-top: 4px;
}

button:hover:not(:disabled) {
  background-color: #4338ca;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mensagem {
  margin-top: 16px;
  padding: 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: center;
}

.mensagem.sucesso {
  background-color: #f0fff4;
  color: #276749;
  border: 1px solid #9ae6b4;
}

.mensagem.erro {
  background-color: #fff5f5;
  color: #c53030;
  border: 1px solid #feb2b2;
}

@media (max-width: 480px) {
  .card {
    padding: 24px 16px;
  }

  h1 {
    font-size: 1.25rem;
  }
}
</style>
