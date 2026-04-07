<template>
  <div class="meeting-preview">
    <svg
        class="meeting-preview__svg"
        viewBox="0 0 420 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="meeting-card-bg" x1="52" y1="34" x2="360" y2="210" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="rgba(255,255,255,0.18)" />
          <stop offset="1" stop-color="rgba(255,255,255,0.04)" />
        </linearGradient>

        <linearGradient id="meeting-accent-1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#F59E0B" />
          <stop offset="1" stop-color="#F97316" />
        </linearGradient>

        <linearGradient id="meeting-accent-2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#FB7185" />
          <stop offset="1" stop-color="#EC4899" />
        </linearGradient>

        <filter id="meeting-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      <circle
          class="meeting-preview__glow meeting-preview__glow--left"
          cx="92"
          cy="70"
          r="42"
          fill="#F59E0B"
          filter="url(#meeting-blur)"
      />
      <circle
          class="meeting-preview__glow meeting-preview__glow--right"
          cx="328"
          cy="170"
          r="46"
          fill="#EC4899"
          filter="url(#meeting-blur)"
      />

      <g class="meeting-preview__panel">
        <rect
            x="48"
            y="30"
            width="324"
            height="180"
            rx="28"
            fill="url(#meeting-card-bg)"
            stroke="rgba(255,255,255,0.12)"
        />

        <rect x="72" y="52" width="112" height="14" rx="7" fill="rgba(255,255,255,0.18)" />
        <rect x="72" y="74" width="82" height="10" rx="5" fill="rgba(255,255,255,0.1)" />

        <g class="meeting-preview__avatars">
          <circle cx="94" cy="114" r="14" fill="url(#meeting-accent-1)" />
          <circle cx="124" cy="114" r="14" fill="#FB7185" fill-opacity="0.92" />
          <circle cx="154" cy="114" r="14" fill="url(#meeting-accent-2)" />
        </g>

        <g class="meeting-preview__event-card">
          <rect
              x="214"
              y="92"
              width="118"
              height="78"
              rx="18"
              fill="rgba(255,255,255,0.08)"
              stroke="rgba(255,255,255,0.08)"
          />
          <rect x="232" y="110" width="54" height="10" rx="5" fill="rgba(255,255,255,0.22)" />
          <rect x="232" y="128" width="74" height="8" rx="4" fill="rgba(255,255,255,0.12)" />
          <rect x="232" y="144" width="46" height="8" rx="4" fill="url(#meeting-accent-1)" />
        </g>

        <g class="meeting-preview__calendar">
          <rect
              x="72"
              y="144"
              width="94"
              height="36"
              rx="14"
              fill="rgba(255,255,255,0.07)"
              stroke="rgba(255,255,255,0.08)"
          />
          <path
              d="M88 162H148"
              stroke="url(#meeting-accent-2)"
              stroke-width="4"
              stroke-linecap="round"
              class="meeting-preview__line"
          />
          <circle cx="112" cy="162" r="5" fill="#F59E0B" />
          <circle cx="136" cy="162" r="5" fill="#EC4899" />
        </g>

        <g class="meeting-preview__badge">
          <rect x="280" y="50" width="54" height="26" rx="13" fill="rgba(255,255,255,0.08)" />
          <circle cx="296" cy="63" r="5" fill="#F59E0B" />
          <rect x="306" y="59" width="16" height="8" rx="4" fill="rgba(255,255,255,0.18)" />
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.meeting-preview {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.meeting-preview__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.meeting-preview__panel {
  transform-origin: center;
  animation: panelFloat 6s ease-in-out infinite;
}

.meeting-preview__glow {
  opacity: 0.4;
}

.meeting-preview__glow--left {
  animation: glowLeft 5s ease-in-out infinite;
}

.meeting-preview__glow--right {
  animation: glowRight 6s ease-in-out infinite;
}

.meeting-preview__avatars {
  transform-origin: center;
  animation: avatarsFloat 4.8s ease-in-out infinite;
}

.meeting-preview__event-card {
  transform-origin: center;
  animation: cardFloat 5.2s ease-in-out infinite;
}

.meeting-preview__calendar {
  transform-origin: center;
  animation: calendarFloat 4.4s ease-in-out infinite;
}

.meeting-preview__badge {
  animation: badgePulse 3.8s ease-in-out infinite;
}

.meeting-preview__line {
  stroke-dasharray: 80;
  stroke-dashoffset: 80;
  animation:
      lineReveal 2s ease forwards,
      linePulse 4s ease-in-out infinite 2s;
}

@keyframes panelFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes avatarsFloat {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-5px) translateX(2px);
  }
}

@keyframes cardFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(6px);
  }
}

@keyframes calendarFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes badgePulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.92;
  }
  50% {
    transform: scale(1.06);
    opacity: 1;
  }
}

@keyframes glowLeft {
  0%, 100% {
    opacity: 0.24;
    transform: scale(1);
  }
  50% {
    opacity: 0.48;
    transform: scale(1.14);
  }
}

@keyframes glowRight {
  0%, 100% {
    opacity: 0.22;
    transform: scale(1);
  }
  50% {
    opacity: 0.46;
    transform: scale(1.12);
  }
}

@keyframes lineReveal {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes linePulse {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}
</style>