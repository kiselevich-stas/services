<template>
  <div class="countdown-list-empty">
    <div class="countdown-empty-state">
      <div class="countdown-empty-state__art" aria-hidden="true">
        <svg
            class="countdown-empty-state__svg"
            viewBox="0 0 320 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="countdownEmptyGlow" x1="40" y1="30" x2="260" y2="200">
              <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.95" />
              <stop offset="50%" stop-color="#EC4899" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#F59E0B" stop-opacity="0.95" />
            </linearGradient>

            <linearGradient id="countdownCardStroke" x1="70" y1="60" x2="250" y2="180">
              <stop offset="0%" stop-color="rgba(255,255,255,0.28)" />
              <stop offset="100%" stop-color="rgba(255,255,255,0.08)" />
            </linearGradient>

            <filter id="countdownBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>

          <circle
              class="countdown-empty-state__orb countdown-empty-state__orb--left"
              cx="84"
              cy="78"
              r="34"
              fill="#8B5CF6"
              fill-opacity="0.26"
              filter="url(#countdownBlur)"
          />
          <circle
              class="countdown-empty-state__orb countdown-empty-state__orb--right"
              cx="242"
              cy="132"
              r="28"
              fill="#EC4899"
              fill-opacity="0.24"
              filter="url(#countdownBlur)"
          />

          <g class="countdown-empty-state__card countdown-empty-state__card--back">
            <rect
                x="86"
                y="56"
                width="132"
                height="104"
                rx="22"
                fill="rgba(255,255,255,0.04)"
                stroke="rgba(255,255,255,0.08)"
            />
          </g>

          <g class="countdown-empty-state__card countdown-empty-state__card--front">
            <rect
                x="104"
                y="42"
                width="132"
                height="104"
                rx="22"
                fill="rgba(15,23,42,0.72)"
                stroke="url(#countdownCardStroke)"
            />

            <rect x="124" y="64" width="22" height="22" rx="11" fill="url(#countdownEmptyGlow)" />
            <rect x="154" y="66" width="58" height="10" rx="5" fill="rgba(255,255,255,0.82)" />
            <rect x="154" y="82" width="42" height="8" rx="4" fill="rgba(255,255,255,0.38)" />

            <rect x="124" y="104" width="88" height="10" rx="5" fill="rgba(255,255,255,0.14)" />
            <rect x="124" y="120" width="64" height="10" rx="5" fill="rgba(255,255,255,0.1)" />

            <rect x="196" y="118" width="20" height="20" rx="10" fill="url(#countdownEmptyGlow)" />
          </g>

          <g class="countdown-empty-state__ring">
            <circle
                cx="74"
                cy="154"
                r="24"
                stroke="rgba(255,255,255,0.1)"
                stroke-width="8"
            />
            <circle
                cx="74"
                cy="154"
                r="24"
                stroke="url(#countdownEmptyGlow)"
                stroke-width="8"
                stroke-linecap="round"
                stroke-dasharray="95 56"
                transform="rotate(-90 74 154)"
            />
          </g>

          <g class="countdown-empty-state__sparkles">
            <circle cx="248" cy="62" r="3.5" fill="#fff" fill-opacity="0.82" />
            <circle cx="265" cy="78" r="2.5" fill="#fff" fill-opacity="0.5" />
            <circle cx="58" cy="52" r="2.5" fill="#fff" fill-opacity="0.6" />
            <path
                d="M270 116L272.4 122.6L279 125L272.4 127.4L270 134L267.6 127.4L261 125L267.6 122.6L270 116Z"
                fill="#F59E0B"
                fill-opacity="0.92"
            />
          </g>
        </svg>
      </div>

      <div class="countdown-empty-state__content">
        <h3 class="countdown-empty-state__title">Пока здесь тихо</h3>

        <p class="countdown-empty-state__text">
          Создай первый "countdown", чтобы следить за важной датой, видеть прогресс ожидания
          и сохранять всё в одном месте.
        </p>

        <div class="countdown-empty-state__actions">
          <RouterLink class="countdown-empty-state__primary" to="/countdowns/new">
            Создать первое событие
          </RouterLink>

          <span class="countdown-empty-state__hint">
            Добавь день рождения, отпуск, релиз или любую важную дату
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped lang="scss">
.countdown-list-empty {
  padding: 12px 0 4px;
}

.countdown-empty-state {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  align-items: center;
  gap: 28px;
  min-height: 280px;
  padding: 28px;
  border-radius: 24px;
  background:
      radial-gradient(circle at top left, rgba(139, 92, 246, 0.14), transparent 34%),
      radial-gradient(circle at right center, rgba(236, 72, 153, 0.1), transparent 30%),
      rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);

  &__art {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__svg {
    width: 100%;
    max-width: 320px;
    height: auto;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  &__title {
    margin: 0;
    font-size: 28px;
    line-height: 1.1;
  }

  &__text {
    margin: 0;
    color: rgba(255, 255, 255, 0.76);
    line-height: 1.6;
    font-size: 15px;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-top: 4px;
  }

  &__primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 46px;
    padding: 0 16px;
    border-radius: 14px;
    background: linear-gradient(135deg, #8b5cf6, #ec4899);
    color: white;
    text-decoration: none;
    font-weight: 600;
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 24px rgba(139, 92, 246, 0.24);
    }
  }

  &__hint {
    color: rgba(255, 255, 255, 0.56);
    font-size: 14px;
    line-height: 1.5;
  }
}

.countdown-empty-state__card--front {
  animation: countdownCardFloat 4.4s ease-in-out infinite;
  transform-origin: center;
}

.countdown-empty-state__card--back {
  animation: countdownCardFloatBack 4.4s ease-in-out infinite;
  transform-origin: center;
}

.countdown-empty-state__ring {
  animation: countdownRingPulse 3.2s ease-in-out infinite;
  transform-origin: center;
}

.countdown-empty-state__sparkles {
  animation: countdownSparklesFloat 3.6s ease-in-out infinite;
  transform-origin: center;
}

.countdown-empty-state__orb--left {
  animation: countdownOrbLeft 5s ease-in-out infinite;
}

.countdown-empty-state__orb--right {
  animation: countdownOrbRight 5.6s ease-in-out infinite;
}

@keyframes countdownCardFloat {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-6px) rotate(-1.2deg);
  }
}

@keyframes countdownCardFloatBack {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(5px) rotate(1deg);
  }
}

@keyframes countdownRingPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.95;
  }
  50% {
    transform: scale(1.04);
    opacity: 1;
  }
}

@keyframes countdownSparklesFloat {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.85;
  }
  50% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

@keyframes countdownOrbLeft {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(-6px, -8px, 0);
  }
}

@keyframes countdownOrbRight {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(8px, 6px, 0);
  }
}

@media (max-width: 900px) {
  .countdown-empty-state {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;

    &__content {
      align-items: center;
    }

    &__actions {
      align-items: center;
    }
  }
}

@media (max-width: 720px) {
  .countdown-empty-state {
    padding: 22px 18px;
    gap: 20px;
    min-height: auto;

    &__title {
      font-size: 24px;
    }

    &__text {
      font-size: 14px;
    }
  }
}
</style>