<template>
  <div class="countdowns-preview">
    <svg
        class="countdowns-preview__svg"
        viewBox="0 0 420 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
            id="countdowns-card-bg"
            x1="36"
            y1="28"
            x2="366"
            y2="222"
            gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.22" />
          <stop offset="1" stop-color="#FFFFFF" stop-opacity="0.04" />
        </linearGradient>

        <linearGradient id="countdowns-accent-1" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#F59E0B" />
          <stop offset="1" stop-color="#EF4444" />
        </linearGradient>

        <linearGradient id="countdowns-accent-2" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#FB7185" />
          <stop offset="1" stop-color="#F97316" />
        </linearGradient>

        <filter id="countdowns-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      <circle
          class="countdowns-preview__glow countdowns-preview__glow--left"
          cx="96"
          cy="62"
          r="42"
          fill="#F59E0B"
          filter="url(#countdowns-blur)"
      />
      <circle
          class="countdowns-preview__glow countdowns-preview__glow--right"
          cx="332"
          cy="176"
          r="46"
          fill="#EF4444"
          filter="url(#countdowns-blur)"
      />

      <g class="countdowns-preview__panel">
        <rect
            x="42"
            y="28"
            width="336"
            height="184"
            rx="28"
            fill="url(#countdowns-card-bg)"
            stroke="rgba(255,255,255,0.14)"
        />

        <rect x="66" y="52" width="104" height="14" rx="7" fill="rgba(255,255,255,0.18)" />
        <rect x="66" y="76" width="82" height="10" rx="5" fill="rgba(255,255,255,0.1)" />

        <g class="countdowns-preview__float countdowns-preview__float--timer">
          <rect
              x="66"
              y="106"
              width="132"
              height="78"
              rx="20"
              fill="rgba(255,255,255,0.08)"
              stroke="rgba(255,255,255,0.08)"
          />

          <circle
              cx="102"
              cy="145"
              r="13"
              stroke="rgba(255,255,255,0.12)"
              stroke-width="7"
          />
          <circle
              cx="102"
              cy="145"
              r="13"
              stroke="url(#countdowns-accent-1)"
              stroke-width="7"
              stroke-linecap="round"
              stroke-dasharray="60 100"
              transform="rotate(-90 102 145)"
              class="countdowns-preview__progress-ring"
          />

          <rect x="128" y="126" width="46" height="12" rx="6" fill="rgba(255,255,255,0.22)" />
          <rect x="128" y="145" width="34" height="8" rx="4" fill="rgba(255,255,255,0.12)" />
          <rect x="82" y="168" width="92" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
        </g>

        <g class="countdowns-preview__float countdowns-preview__float--timeline">
          <rect
              x="220"
              y="102"
              width="126"
              height="86"
              rx="20"
              fill="rgba(255,255,255,0.07)"
              stroke="rgba(255,255,255,0.08)"
          />

          <rect x="242" y="124" width="12" height="40" rx="6" fill="rgba(255,255,255,0.12)" />
          <rect
              x="242"
              y="142"
              width="12"
              height="22"
              rx="6"
              fill="url(#countdowns-accent-1)"
              class="countdowns-preview__bar countdowns-preview__bar--1"
          />

          <rect x="268" y="116" width="12" height="48" rx="6" fill="rgba(255,255,255,0.12)" />
          <rect
              x="268"
              y="132"
              width="12"
              height="32"
              rx="6"
              fill="url(#countdowns-accent-2)"
              class="countdowns-preview__bar countdowns-preview__bar--2"
          />

          <rect x="294" y="130" width="12" height="34" rx="6" fill="rgba(255,255,255,0.12)" />
          <rect
              x="294"
              y="148"
              width="12"
              height="16"
              rx="6"
              fill="url(#countdowns-accent-1)"
              class="countdowns-preview__bar countdowns-preview__bar--3"
          />

          <rect x="320" y="120" width="12" height="44" rx="6" fill="rgba(255,255,255,0.12)" />
          <rect
              x="320"
              y="136"
              width="12"
              height="28"
              rx="6"
              fill="url(#countdowns-accent-2)"
              class="countdowns-preview__bar countdowns-preview__bar--4"
          />
        </g>

        <g class="countdowns-preview__badge">
          <rect
              x="282"
              y="52"
              width="68"
              height="28"
              rx="14"
              fill="rgba(255,255,255,0.08)"
          />
          <circle cx="302" cy="66" r="6" fill="url(#countdowns-accent-1)" />
          <rect x="314" y="61" width="24" height="10" rx="5" fill="rgba(255,255,255,0.18)" />
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.countdowns-preview {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.countdowns-preview__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.countdowns-preview__panel {
  transform-origin: center;
  animation: panelFloat 6s ease-in-out infinite;
}

.countdowns-preview__glow {
  opacity: 0.42;
}

.countdowns-preview__glow--left {
  animation: glowPulseLeft 5s ease-in-out infinite;
}

.countdowns-preview__glow--right {
  animation: glowPulseRight 6.5s ease-in-out infinite;
}

.countdowns-preview__float {
  transform-origin: center;
}

.countdowns-preview__float--timer {
  animation: timerFloat 4.8s ease-in-out infinite;
}

.countdowns-preview__float--timeline {
  animation: timelineFloat 5.8s ease-in-out infinite;
}

.countdowns-preview__badge {
  transform-origin: center;
  animation: badgeFloat 4.2s ease-in-out infinite;
}

.countdowns-preview__progress-ring {
  animation: ringPulse 3.6s ease-in-out infinite;
}

.countdowns-preview__bar {
  transform-box: fill-box;
  transform-origin: bottom center;
}

.countdowns-preview__bar--1 {
  animation: barPulse 2.8s ease-in-out infinite;
}

.countdowns-preview__bar--2 {
  animation: barPulse 3.2s ease-in-out infinite 0.2s;
}

.countdowns-preview__bar--3 {
  animation: barPulse 2.6s ease-in-out infinite 0.4s;
}

.countdowns-preview__bar--4 {
  animation: barPulse 3s ease-in-out infinite 0.15s;
}

@keyframes panelFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes timerFloat {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(-4px) translateX(1px);
  }
}

@keyframes timelineFloat {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(4px) translateX(-1px);
  }
}

@keyframes badgeFloat {
  0%, 100% {
    transform: translateY(0px);
    opacity: 0.95;
  }
  50% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

@keyframes glowPulseLeft {
  0%, 100% {
    opacity: 0.28;
    transform: scale(1);
  }
  50% {
    opacity: 0.54;
    transform: scale(1.12);
  }
}

@keyframes glowPulseRight {
  0%, 100% {
    opacity: 0.24;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.15);
  }
}

@keyframes ringPulse {
  0%, 100% {
    opacity: 0.9;
    transform: rotate(-90deg) scale(1);
    transform-origin: 102px 145px;
  }
  50% {
    opacity: 1;
    transform: rotate(-90deg) scale(1.04);
    transform-origin: 102px 145px;
  }
}

@keyframes barPulse {
  0%, 100% {
    transform: scaleY(0.94);
    opacity: 0.85;
  }
  50% {
    transform: scaleY(1.04);
    opacity: 1;
  }
}
</style>