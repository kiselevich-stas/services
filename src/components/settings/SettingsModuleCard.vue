<script setup lang="ts">
import UiSwitch from '@/components/ui/switch/UiSwitch.vue'
import type { AppModule } from '@/stores/preferences'

defineProps<{
  moduleKey: AppModule
  title: string
  description: string
  badge: string
  enabled: boolean
  loading: boolean
}>()

const emit = defineEmits<{
  (event: 'toggle', module: AppModule, value: boolean): void
}>()

function onToggle(value: boolean, moduleKey: AppModule) {
  emit('toggle', moduleKey, value)
}
</script>

<template>
  <div
      class="settings-module-card"
      :class="{
      'settings-module-card--active': enabled,
    }"
  >
    <div class="settings-module-card__glow settings-module-card__glow--left" />
    <div class="settings-module-card__glow settings-module-card__glow--right" />

    <div class="settings-module-card__content">
      <div class="settings-module-card__topline">
        <span class="settings-module-card__title">{{ title }}</span>
        <span class="settings-module-card__badge">{{ badge }}</span>
      </div>

      <span class="settings-module-card__description">
        {{ description }}
      </span>
    </div>

    <div class="settings-module-card__actions">
      <span
          class="settings-module-card__state"
          :class="{
          'settings-module-card__state--active': enabled,
        }"
      >
        {{ enabled ? 'Включен' : 'Выключен' }}
      </span>

      <UiSwitch
          :model-value="enabled"
          :loading="loading"
          :aria-label="title"
          @update:model-value="onToggle($event, moduleKey)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.settings-module-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  overflow: hidden;
  padding: 22px;
  border-radius: 26px;
  background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.012)),
      rgba(18, 27, 43, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      0 14px 30px rgba(0, 0, 0, 0.18);
  transition:
      transform 0.22s ease,
      border-color 0.22s ease,
      box-shadow 0.22s ease,
      background 0.22s ease;
}

.settings-module-card--active {
  background:
      linear-gradient(135deg, rgba(84, 116, 225, 0.1), rgba(34, 211, 238, 0.04)),
      linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.012)),
      rgba(18, 27, 43, 0.9);
  border-color: rgba(112, 170, 255, 0.16);
}

.settings-module-card__glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(20px);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.settings-module-card--active .settings-module-card__glow {
  opacity: 0.8;
}

.settings-module-card__glow--left {
  top: -40px;
  left: -20px;
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, rgba(105, 124, 255, 0.16), transparent 70%);
}

.settings-module-card__glow--right {
  right: -30px;
  bottom: -50px;
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, rgba(34, 211, 238, 0.12), transparent 70%);
}

.settings-module-card__content {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 10px;
}

.settings-module-card__topline {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.settings-module-card__title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
}

.settings-module-card__badge {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 11px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.07);
  font-size: 12px;
  font-weight: 700;
  color: rgba(214, 226, 255, 0.76);
}

.settings-module-card__description {
  max-width: 560px;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.settings-module-card__actions {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.settings-module-card__state {
  min-width: 84px;
  text-align: right;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-muted);
  transition: color 0.2s ease;
}

.settings-module-card__state--active {
  color: #9ec5ff;
}

@media (max-width: 768px) {
  .settings-module-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 18px;
    border-radius: 22px;
  }

  .settings-module-card__actions {
    width: 100%;
    justify-content: space-between;
  }

  .settings-module-card__state {
    text-align: left;
  }

  .settings-module-card__title {
    font-size: 18px;
  }
}
</style>