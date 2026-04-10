<script setup lang="ts">
defineProps<{
  columnsTemplate: string
}>()
</script>

<template>
  <article
      class="ui-table-row"
      :style="{ gridTemplateColumns: columnsTemplate }"
  >
    <slot />
  </article>
</template>

<style scoped lang="scss">
.ui-table-row {
  display: grid;
  gap: 12px;
  align-items: center;
  min-width: max-content;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.025));
  box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px);
  transition:
      transform 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background 0.2s ease;
}

.ui-table-row:hover {
  transform: translateY(-1px);
  border-color: rgba(139, 92, 246, 0.42);
  background:
      linear-gradient(180deg, rgba(139, 92, 246, 0.08), rgba(236, 72, 153, 0.03));
  box-shadow:
      0 14px 36px rgba(0, 0, 0, 0.22),
      0 0 0 3px rgba(139, 92, 246, 0.08);
}

@media (max-width: 1100px) {
  .ui-table-row {
    min-width: 940px;
  }
}
</style>