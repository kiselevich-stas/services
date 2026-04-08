<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <teleport to="body">
    <div v-if="open" class="ui-modal" @click.self="emit('close')">
      <div class="ui-modal__card">
        <div class="ui-modal__header">
          <h3>{{ title }}</h3>
          <button class="ui-modal__close" type="button" @click="emit('close')">×</button>
        </div>
        <div class="ui-modal__content">
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped lang="scss">
.ui-modal {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}
.ui-modal__card {
  width: min(100%, 560px);
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}
.ui-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid #f3f4f6;

  h3 {
    margin: 0;
    font-size: 18px;
  }
}
.ui-modal__content {
  padding: 20px;
}
.ui-modal__close {
  border: 0;
  background: transparent;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
}
</style>
