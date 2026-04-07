<template>
  <AppShell>
    <RouterView />
    <UiToastViewport />
  </AppShell>
</template>

<script setup lang="ts">
import AppShell from './components/AppShell.vue'
import UiToastViewport from "./components/ui/toasts/UiToastViewport.vue";
</script>
