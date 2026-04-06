<script setup lang="ts">
defineProps<{
  activeCount: number
}>()
</script>

<template>
  <div class="settings-modules-header">
    <div>
      <p class="settings-modules-header__eyebrow">Модули</p>
      <h2 class="settings-modules-header__title">Управление доступностью</h2>
      <p class="settings-modules-header__subtitle">
        Включай только те разделы, которые нужны тебе в приложении.
      </p>
    </div>

    <div class="settings-modules-header__counter">
      <span class="settings-modules-header__counter-value">
        {{ activeCount }}
      </span>
      <span class="settings-modules-header__counter-label">активно</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.settings-modules-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 26px 28px;
  border-radius: 28px;
  background:
      linear-gradient(135deg, rgba(32, 47, 78, 0.94), rgba(16, 29, 48, 0.92) 52%, rgba(13, 72, 98, 0.88));
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      0 18px 36px rgba(0, 0, 0, 0.2);
}

.settings-modules-header__eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: rgba(214, 224, 255, 0.64);
}

.settings-modules-header__title {
  margin: 0 0 10px;
  font-size: clamp(24px, 4vw, 34px);
  line-height: 1.1;
  font-weight: 800;
  color: var(--color-text);
}

.settings-modules-header__subtitle {
  margin: 0;
  max-width: 620px;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.settings-modules-header__counter {
  flex-shrink: 0;
  min-width: 92px;
  padding: 14px 16px;
  border-radius: 22px;
  text-align: center;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
}

.settings-modules-header__counter-value {
  display: block;
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
  color: var(--color-text);
}

.settings-modules-header__counter-label {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .settings-modules-header {
    flex-direction: column;
    padding: 22px 20px;
    border-radius: 24px;
  }

  .settings-modules-header__counter {
    min-width: unset;
    width: 100%;
    text-align: left;
  }
}
</style>