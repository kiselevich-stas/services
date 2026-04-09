<template>
  <section class="match-card match-surface">
    <h3 v-if="title" class="match-card__title">{{ title }}</h3>
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>