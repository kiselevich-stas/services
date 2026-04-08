<script setup lang="ts">
withDefaults(defineProps<{
  tone?: 'neutral' | 'success' | 'warning'
}>(), {
  tone: 'neutral',
})
</script>

<template>
  <span class="ui-badge" :class="`ui-badge--${tone}`"><slot /></span>
</template>

<style scoped lang="scss">
.ui-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  &--neutral { background: #f3f4f6; color: #111827; }
  &--success { background: #dcfce7; color: #166534; }
  &--warning { background: #fef3c7; color: #92400e; }
}
</style>
