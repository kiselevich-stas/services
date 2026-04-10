<script setup lang="ts">
import { RouterLink } from 'vue-router'

type QuickLinkItem = {
  to: string
  label: string
  title: string
  description: string
  modifier: string
}

const quickLinks: QuickLinkItem[] = [
  {
    to: '/hockey',
    label: 'Матчи',
    title: 'Ближайшие встречи',
    description: 'Полное расписание, карточки матчей и страница конкретной игры.',
    modifier: 'matches',
  },
  {
    to: '/hockey/elo',
    label: 'Рейтинг',
    title: 'Elo команд',
    description: 'Смотри актуальную силу команд и переключай сезоны.',
    modifier: 'elo',
  },
  {
    to: '/hockey/teams',
    label: 'Команды',
    title: 'Все клубы этапа',
    description: 'Логотипы, города, дивизионы и конференции на одной странице.',
    modifier: 'teams',
  },
]
</script>

<template>
  <section class="quick-links">
    <RouterLink
        v-for="({ to, label, title, description, modifier }, index) in quickLinks"
        :key="to"
        :to="to"
        :class="['quick-link', `quick-link--${modifier}`]"
        :style="{ '--card-index': index }"
    >
      <div class="quick-link__glow" />

      <div class="quick-link__top">
        <div class="quick-link__icon-wrap">
          <svg
              v-if="modifier === 'matches'"
              class="quick-link__icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
          >
            <path
                d="M7 6.5L10.5 10M17 17.5L13.5 14M8.5 16.5L16.5 8.5M5.5 8.5L8 6L18 16L15.5 18.5L5.5 8.5Z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
          </svg>

          <svg
              v-else-if="modifier === 'elo'"
              class="quick-link__icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
          >
            <path
                d="M5 18.5H19M7.5 15.5L11 12L13.5 14.5L18 9.5"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M15.5 9.5H18V12"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
          </svg>

          <svg
              v-else
              class="quick-link__icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
          >
            <path
                d="M12 4.5L18.5 7.5V12C18.5 16 15.8 18.9 12 20C8.2 18.9 5.5 16 5.5 12V7.5L12 4.5Z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linejoin="round"
            />
            <path
                d="M9.5 12L11.2 13.7L14.8 10.2"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
          </svg>
        </div>

        <span class="quick-link__label">{{ label }}</span>
      </div>

      <div class="quick-link__content">
        <strong class="quick-link__title">
          {{ title }}
        </strong>

        <span class="quick-link__description">
          {{ description }}
        </span>
      </div>

      <div class="quick-link__bottom">
        <span class="quick-link__hint">Открыть раздел</span>

        <span class="quick-link__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
                d="M5 12H19M19 12L13 6M19 12L13 18"
                stroke="currentColor"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
    </RouterLink>
  </section>
</template>

<style scoped lang="scss">
.quick-links {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.quick-link {
  --accent-rgb: 59, 130, 246;

  position: relative;
  display: grid;
  gap: 18px;
  min-height: 220px;
  padding: 22px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
      radial-gradient(circle at top right, rgba(var(--accent-rgb), 0.14), transparent 32%),
      linear-gradient(180deg, rgba(17, 24, 39, 0.96), rgba(13, 18, 35, 0.92));
  text-decoration: none;
  overflow: hidden;
  isolation: isolate;
  box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.03),
      0 14px 30px rgba(0, 0, 0, 0.18);
  transition:
      transform 0.35s ease,
      border-color 0.35s ease,
      box-shadow 0.35s ease,
      background 0.35s ease;
  animation: quick-link-enter 0.55s ease both;
  animation-delay: calc(var(--card-index) * 90ms);
}

.quick-link::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
      linear-gradient(
              115deg,
              transparent 0%,
              rgba(255, 255, 255, 0.06) 30%,
              rgba(255, 255, 255, 0.12) 48%,
              rgba(255, 255, 255, 0.04) 58%,
              transparent 75%
      );
  transform: translateX(-140%);
  transition: transform 0.95s ease;
  z-index: 0;
  pointer-events: none;
}

.quick-link::after {
  content: '';
  position: absolute;
  inset: 1px;
  border-radius: 27px;
  background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.015),
          rgba(255, 255, 255, 0)
  );
  z-index: 0;
  pointer-events: none;
}

.quick-link:hover {
  transform: translateY(-8px);
  border-color: rgba(var(--accent-rgb), 0.5);
  box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      0 22px 46px rgba(0, 0, 0, 0.28),
      0 0 0 1px rgba(var(--accent-rgb), 0.08);
}

.quick-link:hover::before {
  transform: translateX(140%);
}

.quick-link:active {
  transform: translateY(-2px) scale(0.99);
}

.quick-link__glow {
  position: absolute;
  inset: auto auto -80px -60px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--accent-rgb), 0.18), transparent 70%);
  filter: blur(18px);
  z-index: 0;
  pointer-events: none;
  transition:
      transform 0.4s ease,
      opacity 0.4s ease;
  opacity: 0.7;
}

.quick-link:hover .quick-link__glow {
  transform: scale(1.15);
  opacity: 1;
}

.quick-link__top,
.quick-link__content,
.quick-link__bottom {
  position: relative;
  z-index: 1;
}

.quick-link__top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quick-link__icon-wrap {
  position: relative;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  color: rgb(var(--accent-rgb));
  background:
      linear-gradient(180deg, rgba(var(--accent-rgb), 0.18), rgba(var(--accent-rgb), 0.08));
  border: 1px solid rgba(var(--accent-rgb), 0.28);
  box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      0 8px 24px rgba(var(--accent-rgb), 0.15);
  transition:
      transform 0.35s ease,
      box-shadow 0.35s ease,
      border-color 0.35s ease;
}

.quick-link:hover .quick-link__icon-wrap {
  transform: translateY(-2px) scale(1.04) rotate(-2deg);
  border-color: rgba(var(--accent-rgb), 0.42);
  box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.05),
      0 12px 28px rgba(var(--accent-rgb), 0.22);
}

.quick-link__icon {
  width: 24px;
  height: 24px;
}

.quick-link__label {
  color: rgba(255, 255, 255, 0.58);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.quick-link__content {
  display: grid;
  gap: 10px;
}

.quick-link__title {
  color: #fff;
  font-size: 24px;
  line-height: 1.15;
  transition:
      transform 0.3s ease,
      color 0.3s ease;
}

.quick-link:hover .quick-link__title {
  transform: translateX(4px);
}

.quick-link__description {
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.6;
  transition:
      transform 0.3s ease,
      color 0.3s ease;
}

.quick-link:hover .quick-link__description {
  transform: translateX(4px);
  color: rgba(255, 255, 255, 0.82);
}

.quick-link__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  gap: 12px;
}

.quick-link__hint {
  color: rgba(255, 255, 255, 0.54);
  font-size: 13px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.quick-link:hover .quick-link__hint {
  color: rgba(255, 255, 255, 0.76);
}

.quick-link__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition:
      transform 0.3s ease,
      background 0.3s ease,
      border-color 0.3s ease,
      box-shadow 0.3s ease;
}

.quick-link__arrow svg {
  width: 18px;
  height: 18px;
}

.quick-link:hover .quick-link__arrow {
  transform: translateX(4px);
  background: rgba(var(--accent-rgb), 0.18);
  border-color: rgba(var(--accent-rgb), 0.32);
  box-shadow: 0 10px 24px rgba(var(--accent-rgb), 0.16);
}

.quick-link--matches {
  --accent-rgb: 59, 130, 246;
}

.quick-link--elo {
  --accent-rgb: 168, 85, 247;
}

.quick-link--teams {
  --accent-rgb: 34, 197, 94;
}

@keyframes quick-link-enter {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1100px) {
  .quick-links {
    grid-template-columns: 1fr;
  }

  .quick-link {
    min-height: 190px;
  }
}

@media (max-width: 768px) {
  .quick-link {
    min-height: unset;
    padding: 18px;
    border-radius: 24px;
  }

  .quick-link::after {
    border-radius: 23px;
  }

  .quick-link__title {
    font-size: 22px;
  }

  .quick-link__icon-wrap {
    width: 48px;
    height: 48px;
    border-radius: 14px;
  }

  .quick-link__arrow {
    width: 38px;
    height: 38px;
    border-radius: 12px;
  }
}
</style>