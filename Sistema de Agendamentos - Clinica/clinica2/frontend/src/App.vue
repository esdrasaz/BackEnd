<template>
  <div>
    <nav v-if="auth.estaLogado" class="nav">
      <span class="nav-logo">🏥 ClínicaApp</span>
      <div class="nav-links">
        <RouterLink to="/agendamentos">Consultas</RouterLink>
        <RouterLink v-if="auth.ehSecretario" to="/painel">Painel</RouterLink>
      </div>
      <button @click="auth.logout()">Sair</button>
    </nav>
    <main :class="{ 'com-nav': auth.estaLogado }">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
const auth = useAuthStore()
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --verde: #1a6b5a;
  --verde-escuro: #124d41;
  --verde-claro: #e8f5f1;
  --fundo: #f4f7f6;
  --branco: #fff;
  --borda: #d0e0db;
  --texto: #1e2a2a;
  --cinza: #5a7070;
}
body { font-family: 'Segoe UI', system-ui, sans-serif; background: var(--fundo); color: var(--texto); }
.com-nav { padding-top: 60px; }
.nav {
  position: fixed; top: 0; left: 0; right: 0; height: 60px;
  background: var(--verde); display: flex; align-items: center;
  gap: 16px; padding: 0 24px; z-index: 100;
}
.nav-logo { color: #fff; font-weight: 700; font-size: 1.1rem; }
.nav-links { display: flex; gap: 8px; flex: 1; }
.nav-links a { color: rgba(255,255,255,.8); text-decoration: none; padding: 6px 12px; border-radius: 6px; font-size: .9rem; }
.nav-links a:hover, .nav-links a.router-link-active { background: rgba(255,255,255,.2); color: #fff; }
.nav button { background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.3); color: #fff; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: .85rem; }

/* Utilitários globais */
.page { max-width: 800px; margin: 0 auto; padding: 32px 16px; }
.card { background: var(--branco); border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,.08); padding: 24px; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 20px; border-radius: 8px; font-size: .9rem; font-weight: 600; cursor: pointer; border: none; text-decoration: none; transition: opacity .2s; }
.btn:hover { opacity: .85; }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.btn-prim { background: var(--verde); color: #fff; }
.btn-sec { background: transparent; color: var(--verde); border: 2px solid var(--verde); }
.btn-danger { background: #e05a5a; color: #fff; }
.btn-sm { padding: 6px 12px; font-size: .82rem; }
.campo { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
.campo label { font-size: .82rem; font-weight: 600; color: var(--cinza); }
.campo input, .campo select, .campo textarea {
  padding: 10px 12px; border-radius: 8px; border: 2px solid var(--borda);
  font-size: .9rem; font-family: inherit; transition: border-color .2s;
}
.campo input:focus, .campo select:focus, .campo textarea:focus { outline: none; border-color: var(--verde); }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.alerta { padding: 10px 14px; border-radius: 8px; font-size: .88rem; margin-bottom: 14px; }
.alerta-erro   { background: #fce4ec; color: #c62828; border-left: 4px solid #c62828; }
.alerta-ok     { background: #e8f5e9; color: #2e7d32; border-left: 4px solid #2e7d32; }
.alerta-aviso  { background: #fff8e1; color: #e65100; border-left: 4px solid #f9a825; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: .75rem; font-weight: 700; text-transform: uppercase; }
.badge-agendado  { background: #e3f2fd; color: #1565c0; }
.badge-confirmado{ background: #e8f5e9; color: #2e7d32; }
.badge-cancelado { background: #fce4ec; color: #c62828; }
@media (max-width: 600px) { .grid2 { grid-template-columns: 1fr; } }
</style>
