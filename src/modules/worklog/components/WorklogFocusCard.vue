<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface Props {
  project: string
  hours: number
}

const props = defineProps<Props>()

const target = 8

const progress = computed(() => {
  return Math.min((props.hours / target) * 100, 100)
})

const animatedProgress = ref(0)

onMounted(() => {
  setTimeout(() => {
    animatedProgress.value = progress.value
  }, 200)
})

const message = computed(() => {
  if (!props.project) {
    return 'Сегодня пока нет записей. Самое время начать 🚀'
  }

  if (props.hours >= 8) {
    return 'Мощный день! Ты в пике продуктивности 💪'
  }

  if (props.hours >= 4) {
    return 'Хороший темп, держишь фокус 👍'
  }

  return 'Можно усилить концентрацию завтра 🔥'
})
</script>

<template>
  <section class="focus-card">
    <div class="focus-card__glow" />

    <div class="focus-card__header">
      <p class="focus-card__eyebrow">Фокус дня</p>

      <h3 class="focus-card__title">
        {{ props.project || 'Нет данных' }}
      </h3>

      <p class="focus-card__hours">
        {{ props.hours }} ч
      </p>
    </div>

    <!-- 🔥 Progress -->
    <div class="focus-progress">
      <div class="focus-progress__bar">
        <div
            class="focus-progress__fill"
            :style="{ width: animatedProgress + '%' }"
        />
      </div>

      <div class="focus-progress__meta">
        <span>{{ props.hours }} / {{ target }} ч</span>
        <span>{{ Math.round(progress) }}%</span>
      </div>
    </div>

    <p class="focus-card__text">
      {{ message }}
    </p>
  </section>
</template>

<style scoped lang="scss">
.focus-card {
  position: relative;
  padding: 22px;
  border-radius: 26px;
  overflow: hidden;
  background:
      linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04)),
      rgba(10,14,24,0.9);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 20px 50px rgba(0,0,0,0.35);
  display: grid;
  gap: 16px;

  animation: fadeIn 0.6s ease;
}

.focus-card__glow {
  position: absolute;
  inset: -40% -20% auto -20%;
  height: 200px;
  background: radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%);
  filter: blur(60px);
  pointer-events: none;
  animation: pulse 4s infinite ease-in-out;
}

.focus-card__header {
  position: relative;
  z-index: 1;
}

.focus-card__eyebrow {
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(139, 92, 246, 0.9);
}

.focus-card__title {
  margin-top: 6px;
  font-size: 26px;
  color: #fff;
  font-weight: 700;
}

.focus-card__hours {
  margin-top: 4px;
  font-size: 16px;
  color: #86efac;
}

.focus-card__text {
  font-size: 14px;
  color: rgba(255,255,255,0.75);
  line-height: 1.5;
}

/* 🔥 Progress */

.focus-progress {
  display: grid;
  gap: 8px;
}

.focus-progress__bar {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
  overflow: hidden;
}

.focus-progress__fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(
          90deg,
          #8b5cf6,
          #ec4899,
          #06b6d4
  );
  transition: width 0.8s ease;
  box-shadow: 0 0 12px rgba(139,92,246,0.6);
}

.focus-progress__meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(255,255,255,0.6);
}

/* ✨ Animations */

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}
</style>