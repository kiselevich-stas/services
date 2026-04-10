<script setup lang="ts">
import UiSelect from '../../../../components/ui/UiSelect.vue'

defineProps<{
  options: Array<{ label: string; value: string | number }>
  modelValue: string | number
  isLoading: boolean
  label?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | number): void
}>()
</script>

<template>
  <section class="hockey-toolbar">
    <div class="hockey-toolbar__control">
      <UiSelect
          :label="label || 'Выбор'"
          :placeholder="placeholder || 'Выберите значение'"
          :options="options"
          :model-value="modelValue"
          :disabled="isLoading"
          @update:model-value="emit('update:modelValue', $event)"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.hockey-toolbar {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 20px 24px;
  border-radius: 24px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.06);
  animation: fade-up 0.4s ease;
}

.hockey-toolbar__control {
  width: 100%;
  max-width: 320px;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 900px) {
  .hockey-toolbar {
    padding: 16px;
  }

  .hockey-toolbar__control {
    max-width: 100%;
  }
}
</style>