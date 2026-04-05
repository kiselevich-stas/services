<template>
  <div class="app-shell">
    <AppHeader />

    <main class="app-shell__main">
      <div class="container">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppHeader from "./header/AppHeader.vue";
</script>

<style lang="scss">
.app-shell{
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.app-shell__main{
  height: 100%;
  flex-grow: 1;
}
</style>