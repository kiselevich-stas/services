<script setup lang="ts">
import type { WeatherIconType } from '../utils/weatherIcon.ts'

interface Props {
  icon: WeatherIconType | null
  size?: 'sm' | 'md'
}

withDefaults(defineProps<Props>(), {
  size: 'md',
})
</script>

<template>
  <div
      class="weather-icon"
      :class="[
      `weather-icon--${icon ?? 'unknown'}`,
      `weather-icon--${size}`,
    ]"
  >
    <span class="sun" />
    <span class="cloud cloud--main" />
    <span class="cloud cloud--back" />

    <span class="rain rain--1" />
    <span class="rain rain--2" />
    <span class="rain rain--3" />

    <span class="snow snow--1" />
    <span class="snow snow--2" />
    <span class="snow snow--3" />

    <span class="hail hail--1" />
    <span class="hail hail--2" />
    <span class="hail hail--3" />

    <span class="fog fog--1" />
    <span class="mist mist--1" />
    <span class="mist mist--2" />

    <span class="bolt bolt--1" />
    <span class="bolt bolt--2" />
  </div>
</template>

<style scoped lang="scss">
.weather-icon {
  position: relative;

  &--md {
    width: 92px;
    height: 64px;
  }

  &--sm {
    width: 28px;
    height: 20px;
  }
}

.sun,
.cloud,
.rain,
.snow,
.hail,
.fog,
.mist,
.bolt {
  position: absolute;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.rain,
.snow,
.hail {
  will-change: transform, opacity;
}

.sun {
  transform-origin: center;
}

.cloud {
  transform-origin: center;

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
  }
}

.weather-icon--md {
  .sun {
    left: 8px;
    top: 2px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: radial-gradient(circle, #fde68a 0%, #f59e0b 75%);
    box-shadow: 0 0 24px rgba(245, 158, 11, 0.32);
  }

  .cloud {
    width: 50px;
    height: 24px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.88);

    &::before,
    &::after {
      background: rgba(255, 255, 255, 0.88);
      bottom: 8px;
    }

    &::before {
      left: 6px;
      width: 20px;
      height: 20px;
    }

    &::after {
      right: 8px;
      width: 24px;
      height: 24px;
    }

    &--main {
      left: 22px;
      top: 24px;
    }

    &--back {
      left: 12px;
      top: 20px;
      transform: scale(0.72);
      opacity: 0;
    }
  }

  .rain {
    top: 48px;
    width: 3px;
    height: 12px;
    border-radius: 999px;
    background: #7dd3fc;

    &--1 { left: 34px; }
    &--2 { left: 46px; }
    &--3 { left: 58px; }
  }

  .snow {
    top: 50px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #e0f2fe;

    &--1 { left: 34px; }
    &--2 { left: 46px; }
    &--3 { left: 58px; }
  }

  .hail {
    top: 49px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #dbeafe;
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.35);

    &--1 { left: 34px; }
    &--2 { left: 46px; }
    &--3 { left: 58px; }
  }

  .fog,
  .mist {
    left: 16px;
    width: 56px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.58);
  }

  .fog {
    height: 2px;

    &--1 { top: 48px; }
  }

  .mist {
    height: 2px;
    background: rgba(255, 255, 255, 0.42);

    &--1 { top: 40px; }
    &--2 { top: 58px; }
  }

  .bolt {
    width: 10px;
    height: 18px;
    background: #facc15;
    clip-path: polygon(
            45% 0%,
            100% 0%,
            62% 45%,
            100% 45%,
            25% 100%,
            42% 58%,
            0% 58%
    );

    &--1 {
      left: 48px;
      top: 42px;
    }

    &--2 {
      left: 28px;
      top: 38px;
      transform: scale(0.85);
    }
  }
}

.weather-icon--sm {
  .sun {
    left: 2px;
    top: 0;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: radial-gradient(circle, #fde68a 0%, #f59e0b 75%);
    box-shadow: 0 0 10px rgba(245, 158, 11, 0.28);
  }

  .cloud {
    width: 15px;
    height: 8px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.88);

    &::before,
    &::after {
      background: rgba(255, 255, 255, 0.88);
      bottom: 2px;
    }

    &::before {
      left: 2px;
      width: 6px;
      height: 6px;
    }

    &::after {
      right: 2px;
      width: 7px;
      height: 7px;
    }

    &--main {
      left: 8px;
      top: 8px;
    }

    &--back {
      left: 4px;
      top: 6px;
      transform: scale(0.72);
    }
  }

  .rain {
    top: 14px;
    width: 2px;
    height: 5px;
    border-radius: 999px;
    background: #7dd3fc;

    &--1 { left: 10px; }
    &--2 { left: 14px; }
    &--3 { left: 18px; }
  }

  .snow {
    top: 14px;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #e0f2fe;

    &--1 { left: 10px; }
    &--2 { left: 14px; }
    &--3 { left: 18px; }
  }

  .hail {
    top: 14px;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #dbeafe;

    &--1 { left: 10px; }
    &--2 { left: 14px; }
    &--3 { left: 18px; }
  }

  .fog,
  .mist {
    left: 6px;
    width: 16px;
    border-radius: 999px;
  }

  .fog {
    height: 2px;
    background: rgba(255, 255, 255, 0.58);

    &--1 { top: 13px; }
  }

  .mist {
    height: 1px;
    background: rgba(255, 255, 255, 0.4);

    &--1 { top: 11px; }
    &--2 { top: 18px; }
  }

  .bolt {
    width: 4px;
    height: 8px;
    background: #facc15;
    clip-path: polygon(
            45% 0%,
            100% 0%,
            62% 45%,
            100% 45%,
            25% 100%,
            42% 58%,
            0% 58%
    );

    &--1 {
      left: 15px;
      top: 11px;
    }

    &--2 {
      left: 8px;
      top: 10px;
      transform: scale(0.85);
    }
  }
}

@keyframes sunPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

@keyframes cloudFloat {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(4px); }
}

@keyframes cloudFloatSmall {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(2px); }
}

@keyframes rainDrop {
  0% { transform: translateY(0); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(10px); opacity: 0; }
}

@keyframes rainDropSmall {
  0% { transform: translateY(0); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(5px); opacity: 0; }
}

@keyframes drizzleDrop {
  0% { transform: translateY(0); opacity: 0; }
  20% { opacity: 0.7; }
  100% { transform: translateY(7px); opacity: 0; }
}

@keyframes drizzleDropSmall {
  0% { transform: translateY(0); opacity: 0; }
  20% { opacity: 0.7; }
  100% { transform: translateY(4px); opacity: 0; }
}

@keyframes snowFall {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(10px) translateX(2px); opacity: 0; }
}

@keyframes snowFallSmall {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(5px) translateX(1px); opacity: 0; }
}

@keyframes hailDrop {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  25% { opacity: 1; }
  100% { transform: translateY(11px) scale(0.9); opacity: 0; }
}

@keyframes hailDropSmall {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  25% { opacity: 1; }
  100% { transform: translateY(5px) scale(0.9); opacity: 0; }
}

@keyframes fogMove {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(6px); }
}

@keyframes fogMoveSmall {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(2px); }
}

@keyframes lightningFlash {
  0%, 85%, 100% { opacity: 0; }
  88% { opacity: 1; }
  92% { opacity: 0.2; }
  96% { opacity: 1; }
}

.weather-icon--sun {
  .sun {
    opacity: 1;
    animation: sunPulse 2.4s ease-in-out infinite;
  }
}

.weather-icon--partly-cloudy {
  .sun,
  .cloud--main {
    opacity: 1;
  }

  .sun {
    animation: sunPulse 3s ease-in-out infinite;
  }

  &.weather-icon--md .cloud--main {
    animation: cloudFloat 3s ease-in-out infinite;
  }

  &.weather-icon--sm .cloud--main {
    animation: cloudFloatSmall 3s ease-in-out infinite;
  }
}

.weather-icon--overcast {
  .cloud--main,
  .cloud--back {
    opacity: 1;
  }

  .cloud--back {
    opacity: 0.6;
  }

  &.weather-icon--md {
    .cloud--main { animation: cloudFloat 3.2s ease-in-out infinite; }
    .cloud--back { animation: cloudFloat 3.8s ease-in-out infinite reverse; }
  }

  &.weather-icon--sm {
    .cloud--main { animation: cloudFloatSmall 3.2s ease-in-out infinite; }
    .cloud--back { animation: cloudFloatSmall 3.8s ease-in-out infinite reverse; }
  }
}

.weather-icon--fog {
  .cloud--main,
  .fog,
  .mist {
    opacity: 1;
  }

  &.weather-icon--md {
    .cloud--main { animation: cloudFloat 3s ease-in-out infinite; }
    .fog, .mist { animation: fogMove 2.5s ease-in-out infinite; }
  }

  &.weather-icon--sm {
    .cloud--main { animation: cloudFloatSmall 3s ease-in-out infinite; }
    .fog, .mist { animation: fogMoveSmall 2.5s ease-in-out infinite; }
  }

  .fog--2,
  .mist--2 {
    animation-delay: 0.4s;
  }
}

.weather-icon--drizzle {
  .cloud--main,
  .rain {
    opacity: 1;
  }

  .rain {
    transform: scaleY(0.7);
  }

  &.weather-icon--md {
    .cloud--main { animation: cloudFloat 3s ease-in-out infinite; }
    .rain { animation: drizzleDrop 1.2s linear infinite; }
  }

  &.weather-icon--sm {
    .cloud--main { animation: cloudFloatSmall 3s ease-in-out infinite; }
    .rain { animation: drizzleDropSmall 1.2s linear infinite; }
  }

  .rain--1 { animation-delay: 0s; }
  .rain--2 { animation-delay: 0.25s; }
  .rain--3 { animation-delay: 0.5s; }
}

.weather-icon--freezing-rain {
  .cloud--main,
  .rain,
  .snow {
    opacity: 1;
  }

  .snow {
    opacity: 0.7;
  }

  &.weather-icon--md {
    .cloud--main { animation: cloudFloat 3s ease-in-out infinite; }
    .rain { animation: rainDrop 1s linear infinite; }
    .snow { animation: snowFall 1.5s ease-in-out infinite; }
  }

  &.weather-icon--sm {
    .cloud--main { animation: cloudFloatSmall 3s ease-in-out infinite; }
    .rain { animation: rainDropSmall 1s linear infinite; }
    .snow { animation: snowFallSmall 1.5s ease-in-out infinite; }
  }

  .rain--1, .snow--1 { animation-delay: 0s; }
  .rain--2, .snow--2 { animation-delay: 0.2s; }
  .rain--3, .snow--3 { animation-delay: 0.4s; }
}

.weather-icon--rain {
  .cloud--main,
  .rain {
    opacity: 1;
  }

  &.weather-icon--md {
    .cloud--main { animation: cloudFloat 3s ease-in-out infinite; }
    .rain { animation: rainDrop 1s linear infinite; }
  }

  &.weather-icon--sm {
    .cloud--main { animation: cloudFloatSmall 3s ease-in-out infinite; }
    .rain { animation: rainDropSmall 1s linear infinite; }
  }

  .rain--1 { animation-delay: 0s; }
  .rain--2 { animation-delay: 0.2s; }
  .rain--3 { animation-delay: 0.4s; }
}

.weather-icon--snow {
  .cloud--main,
  .snow {
    opacity: 1;
  }

  &.weather-icon--md {
    .cloud--main { animation: cloudFloat 3s ease-in-out infinite; }
    .snow { animation: snowFall 1.8s ease-in-out infinite; }
  }

  &.weather-icon--sm {
    .cloud--main { animation: cloudFloatSmall 3s ease-in-out infinite; }
    .snow { animation: snowFallSmall 1.8s ease-in-out infinite; }
  }

  .snow--1 { animation-delay: 0s; }
  .snow--2 { animation-delay: 0.3s; }
  .snow--3 { animation-delay: 0.6s; }
}

.weather-icon--snow-showers {
  .cloud--main,
  .snow {
    opacity: 1;
  }

  &.weather-icon--md {
    .cloud--main { animation: cloudFloat 2.8s ease-in-out infinite; }
    .snow { animation: snowFall 1.1s ease-in-out infinite; }
  }

  &.weather-icon--sm {
    .cloud--main { animation: cloudFloatSmall 2.8s ease-in-out infinite; }
    .snow { animation: snowFallSmall 1.1s ease-in-out infinite; }
  }

  .snow--1 { animation-delay: 0s; }
  .snow--2 { animation-delay: 0.15s; }
  .snow--3 { animation-delay: 0.3s; }
}

.weather-icon--storm {
  .cloud--main,
  .rain {
    opacity: 1;
  }

  &.weather-icon--md {
    .cloud--main { animation: cloudFloat 2.8s ease-in-out infinite; }
    .rain { animation: rainDrop 0.9s linear infinite; }
  }

  &.weather-icon--sm {
    .cloud--main { animation: cloudFloatSmall 2.8s ease-in-out infinite; }
    .rain { animation: rainDropSmall 0.9s linear infinite; }
  }

  .rain--1 { animation-delay: 0s; }
  .rain--2 { animation-delay: 0.2s; }
  .rain--3 { animation-delay: 0.4s; }

  .bolt--1 {
    animation: lightningFlash 1s ease-in-out infinite;
  }

  .bolt--2 {
    animation: lightningFlash 1.3s ease-in-out infinite;
    animation-delay: 0.7s;
  }
}

.weather-icon--hail-storm {
  .cloud--main,
  .hail {
    opacity: 1;
  }

  &.weather-icon--md {
    .cloud--main { animation: cloudFloat 2.6s ease-in-out infinite; }
    .hail { animation: hailDrop 0.75s linear infinite; }
  }

  &.weather-icon--sm {
    .cloud--main { animation: cloudFloatSmall 2.6s ease-in-out infinite; }
    .hail { animation: hailDropSmall 0.75s linear infinite; }
  }

  .hail--1 { animation-delay: 0s; }
  .hail--2 { animation-delay: 0.16s; }
  .hail--3 { animation-delay: 0.32s; }

  .bolt--1 {
    animation: lightningFlash 1s ease-in-out infinite;
  }

  .bolt--2 {
    animation: lightningFlash 1.35s ease-in-out infinite;
    animation-delay: 0.75s;
  }
}
</style>