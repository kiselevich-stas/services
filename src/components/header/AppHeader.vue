<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <RouterLink to="/" class="app-header__logo">
        Pulse
      </RouterLink>
      <router-link to="/settings">
        Настройки
      </router-link>
      <HeaderAuth />
    </div>
  </header>
</template>

<script setup lang="ts">
import HeaderAuth from './HeaderAuth.vue'
</script>