<template>
  <div class="countdown-status">
    <div class="countdown-status__badge"></div>

    <div class="countdown-status__content">
      <p class="countdown-status__label">Статус</p>
      <strong class="countdown-status__title">{{ title }}</strong>
      <p class="countdown-status__text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  text: string
}>()
</script>

<style scoped lang="scss">
.countdown-status {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.06);

  &__badge {
    flex-shrink: 0;
    width: 10px;
    height: 10px;
    margin-top: 7px;
    border-radius: 999px;
    background: var(--countdown-accent);
    box-shadow: 0 0 16px color-mix(in srgb, var(--countdown-accent) 60%, transparent);
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__label {
    margin: 0;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.58);
  }

  &__title {
    font-size: 18px;
    line-height: 1.2;
  }

  &__text {
    margin: 0;
    color: rgba(255, 255, 255, 0.72);
    line-height: 1.45;
  }
}
</style>