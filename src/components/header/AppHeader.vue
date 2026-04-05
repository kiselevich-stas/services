<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <RouterLink to="/" class="app-header__logo">
        Pulse
      </RouterLink>
<!--      <nav class="app-header__nav">-->
<!--        <RouterLink to="/weather" class="app-header__link">Погода</RouterLink>-->
<!--        <RouterLink to="/countdowns" class="app-header__link">Ожидания</RouterLink>-->
<!--      </nav>-->

      <HeaderAuth />
    </div>
  </header>
</template>

<script setup lang="ts">
import HeaderAuth from './HeaderAuth.vue'
</script>