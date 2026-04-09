<template>
  <div class="hockey-stats-preview">
    <svg
        class="hockey-stats-preview__svg"
        viewBox="0 0 420 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
            id="hockey-card-bg"
            x1="40"
            y1="26"
            x2="374"
            y2="220"
            gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.22" />
          <stop offset="1" stop-color="#FFFFFF" stop-opacity="0.04" />
        </linearGradient>

        <linearGradient id="hockey-accent-1" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#38BDF8" />
          <stop offset="1" stop-color="#2563EB" />
        </linearGradient>

        <linearGradient id="hockey-accent-2" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#FB7185" />
          <stop offset="1" stop-color="#EF4444" />
        </linearGradient>

        <linearGradient id="hockey-accent-3" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#7DD3FC" />
          <stop offset="1" stop-color="#38BDF8" />
        </linearGradient>

        <filter id="hockey-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      <!-- Glow -->
      <circle
          class="hockey-stats-preview__glow hockey-stats-preview__glow--left"
          cx="88"
          cy="60"
          r="44"
          fill="#38BDF8"
          filter="url(#hockey-blur)"
      />
      <circle
          class="hockey-stats-preview__glow hockey-stats-preview__glow--right"
          cx="334"
          cy="176"
          r="48"
          fill="#EF4444"
          filter="url(#hockey-blur)"
      />

      <g class="hockey-stats-preview__panel">
        <!-- Main card -->
        <rect
            x="42"
            y="28"
            width="336"
            height="184"
            rx="28"
            fill="url(#hockey-card-bg)"
            stroke="white"
            stroke-opacity="0.12"
        />

        <!-- Header -->
        <rect x="64" y="48" width="118" height="14" rx="7" fill="rgba(255,255,255,0.18)" />
        <rect x="64" y="72" width="88" height="10" rx="5" fill="rgba(255,255,255,0.10)" />

        <!-- Top badge -->
        <g class="hockey-stats-preview__badge">
          <rect
              x="278"
              y="46"
              width="74"
              height="32"
              rx="16"
              fill="rgba(255,255,255,0.08)"
          />
          <circle cx="298" cy="62" r="6" fill="url(#hockey-accent-3)" />
          <rect x="310" y="57" width="24" height="10" rx="5" fill="rgba(255,255,255,0.18)" />
        </g>

        <!-- Left: head-to-head summary -->
        <g class="hockey-stats-preview__float hockey-stats-preview__float--summary">
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

          <!-- ring -->
          <circle
              cx="98"
              cy="146"
              r="20"
              stroke="rgba(255,255,255,0.12)"
              stroke-width="7"
          />
          <circle
              cx="98"
              cy="146"
              r="20"
              stroke="url(#hockey-accent-1)"
              stroke-width="7"
              stroke-linecap="round"
              stroke-dasharray="72 120"
              transform="rotate(-90 98 146)"
              class="hockey-stats-preview__ring"
          />

          <!-- puck -->
          <g class="hockey-stats-preview__puck">
            <ellipse cx="98" cy="146" rx="8" ry="5.5" fill="#111827" />
            <ellipse cx="98" cy="144.2" rx="5.8" ry="2" fill="rgba(255,255,255,0.12)" />
          </g>

          <!-- text imitation -->
          <rect x="126" y="126" width="44" height="10" rx="5" fill="rgba(255,255,255,0.18)" />
          <rect x="126" y="142" width="28" height="8" rx="4" fill="rgba(255,255,255,0.1)" />
          <rect x="126" y="158" width="54" height="8" rx="4" fill="rgba(255,255,255,0.08)" />

          <!-- bottom metric line -->
          <rect x="80" y="176" width="100" height="6" rx="3" fill="rgba(255,255,255,0.08)" />
        </g>

        <!-- Right: hockey stats -->
        <g class="hockey-stats-preview__float hockey-stats-preview__float--stats">
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

          <!-- bars background -->
          <rect x="254" y="128" width="10" height="36" rx="5" fill="rgba(255,255,255,0.12)" />
          <rect x="272" y="120" width="10" height="44" rx="5" fill="rgba(255,255,255,0.12)" />
          <rect x="290" y="132" width="10" height="32" rx="5" fill="rgba(255,255,255,0.12)" />
          <rect x="308" y="116" width="10" height="48" rx="5" fill="rgba(255,255,255,0.12)" />

          <!-- animated bars -->
          <rect
              x="254"
              y="136"
              width="10"
              height="28"
              rx="5"
              fill="url(#hockey-accent-1)"
              class="hockey-stats-preview__bar hockey-stats-preview__bar--1"
          />
          <rect
              x="272"
              y="126"
              width="10"
              height="38"
              rx="5"
              fill="url(#hockey-accent-2)"
              class="hockey-stats-preview__bar hockey-stats-preview__bar--2"
          />
          <rect
              x="290"
              y="140"
              width="10"
              height="24"
              rx="5"
              fill="url(#hockey-accent-1)"
              class="hockey-stats-preview__bar hockey-stats-preview__bar--3"
          />
          <rect
              x="308"
              y="122"
              width="10"
              height="42"
              rx="5"
              fill="url(#hockey-accent-2)"
              class="hockey-stats-preview__bar hockey-stats-preview__bar--4"
          />

          <!-- top labels imitation -->
          <rect x="252" y="106" width="44" height="8" rx="4" fill="rgba(255,255,255,0.14)" />
          <rect x="300" y="106" width="20" height="8" rx="4" fill="rgba(255,255,255,0.08)" />

          <!-- bottom line -->
          <rect x="256" y="174" width="66" height="8" rx="4" fill="rgba(255,255,255,0.12)" />
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.hockey-stats-preview {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hockey-stats-preview__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.hockey-stats-preview__panel {
  transform-origin: center;
  animation: hockeyPanelFloat 6s ease-in-out infinite;
}

.hockey-stats-preview__glow {
  opacity: 0.42;
}

.hockey-stats-preview__glow--left {
  animation: hockeyGlowLeft 5.5s ease-in-out infinite;
}

.hockey-stats-preview__glow--right {
  animation: hockeyGlowRight 6.2s ease-in-out infinite;
}

.hockey-stats-preview__float {
  transform-origin: center;
}

.hockey-stats-preview__float--summary {
  animation: hockeySummaryFloat 5s ease-in-out infinite;
}

.hockey-stats-preview__float--stats {
  animation: hockeyStatsFloat 5.8s ease-in-out infinite;
}

.hockey-stats-preview__badge {
  transform-origin: center;
  animation: hockeyBadgeFloat 4.2s ease-in-out infinite;
}


.hockey-stats-preview__puck {
  transform-origin: center;
}

.hockey-stats-preview__bar {
  transform-box: fill-box;
  transform-origin: bottom center;
}

.hockey-stats-preview__bar--1 {
  animation: hockeyBarPulse 2.7s ease-in-out infinite;
}

.hockey-stats-preview__bar--2 {
  animation: hockeyBarPulse 3s ease-in-out infinite 0.15s;
}

.hockey-stats-preview__bar--3 {
  animation: hockeyBarPulse 2.8s ease-in-out infinite 0.3s;
}

.hockey-stats-preview__bar--4 {
  animation: hockeyBarPulse 3.1s ease-in-out infinite 0.1s;
}

@keyframes hockeyPanelFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes hockeySummaryFloat {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-4px) translateX(1px);
  }
}

@keyframes hockeyStatsFloat {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(4px) translateX(-1px);
  }
}

@keyframes hockeyBadgeFloat {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.94;
  }
  50% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

@keyframes hockeyGlowLeft {
  0%, 100% {
    opacity: 0.28;
    transform: scale(1);
  }
  50% {
    opacity: 0.56;
    transform: scale(1.12);
  }
}

@keyframes hockeyGlowRight {
  0%, 100% {
    opacity: 0.24;
    transform: scale(1);
  }
  50% {
    opacity: 0.48;
    transform: scale(1.14);
  }
}

@keyframes hockeyRingPulse {
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

@keyframes hockeyPuckPulse {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-1px) scale(1.05);
  }
}

@keyframes hockeyBarPulse {
  0%, 100% {
    transform: scaleY(0.92);
    opacity: 0.84;
  }
  50% {
    transform: scaleY(1.05);
    opacity: 1;
  }
}
</style>