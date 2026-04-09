<template>
  <div class="worklog-preview">
    <svg
        class="worklog-preview__svg"
        viewBox="0 0 420 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
            id="worklog-card-bg"
            x1="40"
            y1="26"
            x2="374"
            y2="220"
            gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.22" />
          <stop offset="1" stop-color="#FFFFFF" stop-opacity="0.04" />
        </linearGradient>

        <linearGradient id="worklog-accent-1" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#EC4899" />
          <stop offset="1" stop-color="#8B5CF6" />
        </linearGradient>

        <linearGradient id="worklog-accent-2" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#06B6D4" />
          <stop offset="1" stop-color="#8B5CF6" />
        </linearGradient>

        <linearGradient id="worklog-accent-3" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#22C55E" />
          <stop offset="1" stop-color="#06B6D4" />
        </linearGradient>

        <filter id="worklog-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      <!-- Glow -->
      <circle
          class="worklog-preview__glow worklog-preview__glow--left"
          cx="88"
          cy="60"
          r="44"
          fill="#EC4899"
          filter="url(#worklog-blur)"
      />
      <circle
          class="worklog-preview__glow worklog-preview__glow--right"
          cx="334"
          cy="176"
          r="48"
          fill="#06B6D4"
          filter="url(#worklog-blur)"
      />

      <g class="worklog-preview__panel">
        <!-- Main card -->
        <rect
            x="42"
            y="28"
            width="336"
            height="184"
            rx="28"
            fill="url(#worklog-card-bg)"
            stroke="white"
            stroke-opacity="0.12"
        />

        <!-- Header -->
        <rect x="64" y="48" width="118" height="14" rx="7" fill="rgba(255,255,255,0.18)" />
        <rect x="64" y="72" width="88" height="10" rx="5" fill="rgba(255,255,255,0.10)" />

        <!-- Top badge -->
        <g class="worklog-preview__badge">
          <rect
              x="278"
              y="46"
              width="74"
              height="32"
              rx="16"
              fill="rgba(255,255,255,0.08)"
          />
          <circle cx="298" cy="62" r="6" fill="url(#worklog-accent-3)" />
          <rect x="310" y="57" width="24" height="10" rx="5" fill="rgba(255,255,255,0.18)" />
        </g>

        <!-- Left: time log card -->
        <g class="worklog-preview__float worklog-preview__float--logs">
          <rect
              x="62"
              y="102"
              width="152"
              height="88"
              rx="22"
              fill="rgba(255,255,255,0.07)"
              stroke="white"
              stroke-opacity="0.08"
          />

          <!-- log item 1 -->
          <circle cx="82" cy="124" r="5" fill="url(#worklog-accent-1)" />
          <rect x="94" y="119" width="54" height="9" rx="4.5" fill="rgba(255,255,255,0.16)" />
          <rect x="154" y="119" width="34" height="9" rx="4.5" fill="rgba(255,255,255,0.08)" />

          <!-- log item 2 -->
          <circle cx="82" cy="146" r="5" fill="url(#worklog-accent-2)" />
          <rect x="94" y="141" width="70" height="9" rx="4.5" fill="rgba(255,255,255,0.14)" />
          <rect x="170" y="141" width="18" height="9" rx="4.5" fill="rgba(255,255,255,0.08)" />

          <!-- log item 3 -->
          <circle cx="82" cy="168" r="5" fill="url(#worklog-accent-3)" />
          <rect x="94" y="163" width="44" height="9" rx="4.5" fill="rgba(255,255,255,0.14)" />
          <rect x="144" y="163" width="44" height="9" rx="4.5" fill="url(#worklog-accent-1)" />
        </g>

        <!-- Right: timer / clock -->
        <g class="worklog-preview__float worklog-preview__float--timer">
          <rect
              x="228"
              y="96"
              width="122"
              height="94"
              rx="24"
              fill="rgba(255,255,255,0.08)"
              stroke="white"
              stroke-opacity="0.08"
          />

          <!-- timer ring -->
          <circle
              cx="289"
              cy="136"
              r="24"
              stroke="rgba(255,255,255,0.12)"
              stroke-width="8"
          />
          <circle
              class="worklog-preview__ring"
              cx="289"
              cy="136"
              r="24"
              stroke="url(#worklog-accent-2)"
              stroke-width="8"
              stroke-linecap="round"
              stroke-dasharray="112 40"
              transform="rotate(-90 289 136)"
          />

          <!-- clock hands -->
          <line
              x1="289"
              y1="136"
              x2="289"
              y2="122"
              stroke="white"
              stroke-opacity="0.92"
              stroke-width="3.5"
              stroke-linecap="round"
              class="worklog-preview__hand worklog-preview__hand--hour"
          />
          <line
              x1="289"
              y1="136"
              x2="301"
              y2="142"
              stroke="white"
              stroke-opacity="0.82"
              stroke-width="3"
              stroke-linecap="round"
              class="worklog-preview__hand worklog-preview__hand--minute"
          />
          <circle cx="289" cy="136" r="3.5" fill="#FFFFFF" fill-opacity="0.95" />

          <!-- time text imitation -->
          <rect x="257" y="170" width="64" height="8" rx="4" fill="rgba(255,255,255,0.14)" />
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.worklog-preview {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.worklog-preview__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.worklog-preview__panel {
  transform-origin: center;
  animation: worklogPanelFloat 6s ease-in-out infinite;
}

.worklog-preview__glow {
  opacity: 0.42;
}

.worklog-preview__glow--left {
  animation: worklogGlowLeft 5.5s ease-in-out infinite;
}

.worklog-preview__glow--right {
  animation: worklogGlowRight 6.2s ease-in-out infinite;
}

.worklog-preview__float {
  transform-origin: center;
}

.worklog-preview__float--logs {
  animation: worklogLogsFloat 5s ease-in-out infinite;
}

.worklog-preview__float--timer {
  animation: worklogTimerFloat 5.8s ease-in-out infinite;
}

.worklog-preview__badge {
  transform-origin: center;
  animation: worklogBadgeFloat 4.2s ease-in-out infinite;
}

.worklog-preview__ring {
  animation: worklogRingPulse 3.8s ease-in-out infinite;
}

.worklog-preview__hand {
  transform-origin: 289px 136px;
}

.worklog-preview__hand--hour {
  animation: worklogHourHand 7s linear infinite;
}

.worklog-preview__hand--minute {
  animation: worklogMinuteHand 5s linear infinite;
}

@keyframes worklogPanelFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes worklogLogsFloat {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-4px) translateX(1px);
  }
}

@keyframes worklogTimerFloat {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(4px) translateX(-1px);
  }
}

@keyframes worklogBadgeFloat {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.94;
  }
  50% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

@keyframes worklogGlowLeft {
  0%, 100% {
    opacity: 0.28;
    transform: scale(1);
  }
  50% {
    opacity: 0.56;
    transform: scale(1.12);
  }
}

@keyframes worklogGlowRight {
  0%, 100% {
    opacity: 0.24;
    transform: scale(1);
  }
  50% {
    opacity: 0.48;
    transform: scale(1.14);
  }
}

@keyframes worklogRingPulse {
  0%, 100% {
    opacity: 0.95;
    transform: scale(1);
    transform-origin: center;
  }
  50% {
    opacity: 1;
    transform: scale(1.03);
    transform-origin: center;
  }
}

@keyframes worklogHourHand {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes worklogMinuteHand {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>