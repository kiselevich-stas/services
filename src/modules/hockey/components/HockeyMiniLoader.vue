<script setup lang="ts">
withDefaults(
    defineProps<{
      text?: string
    }>(),
    {
      text: 'Идёт обновление данных...',
    },
)
</script>

<template>
  <div class="hockey-mini-loader" role="status" aria-live="polite">
    <span class="hockey-mini-loader__spinner" />
    <span class="hockey-mini-loader__text">{{ text }}</span>
  </div>
</template>

<style scoped lang="scss">
.hockey-mini-loader {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.24);
  color: #e2e8f0;
  backdrop-filter: blur(8px);
}

.hockey-mini-loader__spinner {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.28);
  border-top-color: #ffffff;
  animation: hockey-spin 0.8s linear infinite;
}

.hockey-mini-loader__text {
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
}

@keyframes hockey-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>