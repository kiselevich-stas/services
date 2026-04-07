<template>
  <div class="weather-preview">
    <svg
        class="weather-preview__svg"
        viewBox="0 0 420 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="weather-card-bg" x1="36" y1="28" x2="366" y2="222" gradientUnits="userSpaceOnUse">
          <stop stop-color="rgba(255,255,255,0.22)" />
          <stop offset="1" stop-color="rgba(255,255,255,0.04)" />
        </linearGradient>

        <linearGradient id="weather-accent-sun" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#FDE68A" />
          <stop offset="1" stop-color="#F59E0B" />
        </linearGradient>

        <linearGradient id="weather-accent-sky" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#60A5FA" />
          <stop offset="1" stop-color="#22D3EE" />
        </linearGradient>

        <linearGradient id="weather-accent-line" x1="230" y1="118" x2="338" y2="160" gradientUnits="userSpaceOnUse">
          <stop stop-color="#38BDF8" />
          <stop offset="1" stop-color="#FBBF24" />
        </linearGradient>

        <filter id="weather-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      <circle
          class="weather-preview__glow weather-preview__glow--left"
          cx="92"
          cy="66"
          r="42"
          fill="#38BDF8"
          filter="url(#weather-blur)"
      />

      <circle
          class="weather-preview__glow weather-preview__glow--right"
          cx="328"
          cy="172"
          r="48"
          fill="#FBBF24"
          filter="url(#weather-blur)"
      />

      <g class="weather-preview__panel">
        <rect
            x="42"
            y="28"
            width="336"
            height="184"
            rx="28"
            fill="url(#weather-card-bg)"
            stroke="rgba(255,255,255,0.14)"
        />

        <rect x="66" y="52" width="104" height="14" rx="7" fill="rgba(255,255,255,0.18)" />
        <rect x="66" y="76" width="138" height="10" rx="5" fill="rgba(255,255,255,0.10)" />

        <g class="weather-preview__float weather-preview__float--summary">
          <rect
              x="66"
              y="104"
              width="126"
              height="78"
              rx="20"
              fill="rgba(255,255,255,0.08)"
              stroke="rgba(255,255,255,0.08)"
          />

          <circle cx="102" cy="132" r="16" fill="url(#weather-accent-sun)" class="weather-preview__sun" />

          <g class="weather-preview__cloud">
            <circle cx="130" cy="138" r="10" fill="rgba(255,255,255,0.85)" />
            <circle cx="142" cy="134" r="12" fill="rgba(255,255,255,0.92)" />
            <circle cx="156" cy="139" r="9" fill="rgba(255,255,255,0.82)" />
            <rect x="122" y="139" width="42" height="12" rx="6" fill="rgba(255,255,255,0.88)" />
          </g>

          <rect x="84" y="160" width="54" height="8" rx="4" fill="rgba(255,255,255,0.18)" />
          <rect x="144" y="160" width="28" height="8" rx="4" fill="rgba(255,255,255,0.10)" />
        </g>

        <g class="weather-preview__float weather-preview__float--chart">
          <rect
              x="214"
              y="102"
              width="132"
              height="86"
              rx="20"
              fill="rgba(255,255,255,0.07)"
              stroke="rgba(255,255,255,0.08)"
          />

          <rect x="228" y="118" width="24" height="8" rx="4" fill="rgba(255,255,255,0.12)" />
          <rect x="258" y="118" width="18" height="8" rx="4" fill="rgba(255,255,255,0.08)" />

          <path
              class="weather-preview__line"
              d="M232 160C244 154 252 146 264 148C276 150 286 130 298 132C310 134 320 118 336 120"
              stroke="url(#weather-accent-line)"
              stroke-width="5"
              stroke-linecap="round"
              stroke-linejoin="round"
          />

          <circle cx="264" cy="148" r="4" fill="#38BDF8" />
          <circle cx="298" cy="132" r="4" fill="#7DD3FC" />
          <circle cx="336" cy="120" r="4" fill="#FBBF24" />
        </g>

        <g class="weather-preview__badge">
          <rect x="280" y="52" width="70" height="28" rx="14" fill="rgba(255,255,255,0.08)" />
          <circle cx="300" cy="66" r="6" fill="url(#weather-accent-sky)" />
          <rect x="312" y="61" width="24" height="10" rx="5" fill="rgba(255,255,255,0.18)" />
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.weather-preview {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.weather-preview__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.weather-preview__panel {
  transform-origin: center;
  animation: weatherPanelFloat 6s ease-in-out infinite;
}

.weather-preview__glow {
  opacity: 0.42;
}

.weather-preview__glow--left {
  animation: weatherGlowPulseLeft 5s ease-in-out infinite;
}

.weather-preview__glow--right {
  animation: weatherGlowPulseRight 6.5s ease-in-out infinite;
}

.weather-preview__float {
  transform-origin: center;
}

.weather-preview__float--summary {
  animation: weatherSummaryFloat 4.8s ease-in-out infinite;
}

.weather-preview__float--chart {
  animation: weatherChartFloat 5.8s ease-in-out infinite;
}

.weather-preview__badge {
  transform-origin: center;
  animation: weatherBadgeFloat 4.2s ease-in-out infinite;
}

.weather-preview__sun {
  transform-origin: center;
  animation: weatherSunPulse 4.4s ease-in-out infinite;
}

.weather-preview__cloud {
  animation: weatherCloudFloat 5.2s ease-in-out infinite;
}

.weather-preview__line {
  stroke-dasharray: 160;
  stroke-dashoffset: 160;
  animation:
      weatherLineReveal 2.8s ease forwards,
      weatherLinePulse 4.5s ease-in-out infinite 2.8s;
}

@keyframes weatherPanelFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes weatherSummaryFloat {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(-6px) translateX(2px);
  }
}

@keyframes weatherChartFloat {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(5px) translateX(-2px);
  }
}

@keyframes weatherBadgeFloat {
  0%, 100% {
    transform: translateY(0px);
    opacity: 0.95;
  }
  50% {
    transform: translateY(-5px);
    opacity: 1;
  }
}

@keyframes weatherGlowPulseLeft {
  0%, 100% {
    opacity: 0.26;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.12);
  }
}

@keyframes weatherGlowPulseRight {
  0%, 100% {
    opacity: 0.22;
    transform: scale(1);
  }
  50% {
    opacity: 0.48;
    transform: scale(1.15);
  }
}

@keyframes weatherSunPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.95;
  }
  50% {
    transform: scale(1.08);
    opacity: 1;
  }
}

@keyframes weatherCloudFloat {
  0%, 100% {
    transform: translateX(0px);
  }
  50% {
    transform: translateX(3px);
  }
}

@keyframes weatherLineReveal {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes weatherLinePulse {
  0%, 100% {
    opacity: 0.85;
  }
  50% {
    opacity: 1;
  }
}
</style>