<template>
  <div class="vacation-preview">
    <svg
        class="vacation-preview__svg"
        viewBox="0 0 420 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
            id="vacation-card-bg"
            x1="42"
            y1="26"
            x2="376"
            y2="218"
            gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.22" />
          <stop offset="1" stop-color="#FFFFFF" stop-opacity="0.04" />
        </linearGradient>

        <linearGradient id="vacation-accent-1" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#EC4899" />
          <stop offset="1" stop-color="#8B5CF6" />
        </linearGradient>

        <linearGradient id="vacation-accent-2" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#06B6D4" />
          <stop offset="1" stop-color="#22C55E" />
        </linearGradient>

        <linearGradient id="vacation-accent-3" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#F59E0B" />
          <stop offset="1" stop-color="#EC4899" />
        </linearGradient>

        <filter id="vacation-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      <!-- Glow -->
      <circle
          class="vacation-preview__glow vacation-preview__glow--left"
          cx="92"
          cy="58"
          r="46"
          fill="#EC4899"
          filter="url(#vacation-blur)"
      />
      <circle
          class="vacation-preview__glow vacation-preview__glow--right"
          cx="332"
          cy="176"
          r="50"
          fill="#06B6D4"
          filter="url(#vacation-blur)"
      />

      <g class="vacation-preview__panel">
        <!-- Main card -->
        <rect
            x="42"
            y="28"
            width="336"
            height="184"
            rx="28"
            fill="url(#vacation-card-bg)"
            stroke="white"
            stroke-opacity="0.12"
        />

        <!-- Header -->
        <rect x="64" y="48" width="92" height="14" rx="7" fill="rgba(255,255,255,0.18)" />
        <rect x="64" y="72" width="126" height="10" rx="5" fill="rgba(255,255,255,0.10)" />

        <!-- chips -->
        <g class="vacation-preview__badge vacation-preview__badge--left">
          <rect
              x="266"
              y="46"
              width="40"
              height="28"
              rx="14"
              fill="rgba(255,255,255,0.08)"
          />
          <rect
              x="314"
              y="46"
              width="44"
              height="28"
              rx="14"
              fill="rgba(255,255,255,0.08)"
          />
          <circle cx="282" cy="60" r="6" fill="url(#vacation-accent-1)" />
          <rect x="329" y="55" width="14" height="10" rx="5" fill="url(#vacation-accent-2)" />
        </g>

        <!-- Left card: route/map -->
        <g class="vacation-preview__float vacation-preview__float--map">
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

          <!-- soft map lines -->
          <path
              d="M80 120C95 112 112 114 126 126C142 139 157 140 176 130C186 124 195 123 202 126"
              stroke="rgba(255,255,255,0.10)"
              stroke-width="5"
              stroke-linecap="round"
          />
          <path
              d="M82 162C97 150 116 146 132 154C147 161 161 160 182 148"
              stroke="rgba(255,255,255,0.08)"
              stroke-width="4"
              stroke-linecap="round"
          />

          <!-- route -->
          <path
              class="vacation-preview__route"
              d="M86 168C102 154 120 142 136 132C148 124 166 124 186 138"
              stroke="url(#vacation-accent-2)"
              stroke-width="4"
              stroke-linecap="round"
              stroke-dasharray="120 120"
          />

          <!-- points -->
          <circle cx="86" cy="168" r="6" fill="url(#vacation-accent-1)" />
          <circle cx="136" cy="132" r="6" fill="url(#vacation-accent-3)" />
          <circle cx="186" cy="138" r="6" fill="url(#vacation-accent-2)" />

          <!-- tiny labels -->
          <rect x="74" y="178" width="24" height="7" rx="3.5" fill="rgba(255,255,255,0.14)" />
          <rect x="124" y="142" width="22" height="7" rx="3.5" fill="rgba(255,255,255,0.14)" />
          <rect x="172" y="148" width="24" height="7" rx="3.5" fill="rgba(255,255,255,0.14)" />
        </g>

        <!-- Right card: checklist -->
        <g class="vacation-preview__float vacation-preview__float--checklist">
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

          <!-- top line -->
          <rect x="248" y="112" width="54" height="8" rx="4" fill="rgba(255,255,255,0.16)" />
          <rect x="308" y="112" width="24" height="8" rx="4" fill="rgba(255,255,255,0.08)" />

          <!-- checklist row 1 -->
          <rect x="248" y="132" width="12" height="12" rx="6" fill="url(#vacation-accent-2)" />
          <path
              d="M251 138L255 141L259 135"
              stroke="white"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
          />
          <rect x="268" y="134" width="42" height="8" rx="4" fill="rgba(255,255,255,0.16)" />

          <!-- checklist row 2 -->
          <rect x="248" y="152" width="12" height="12" rx="6" fill="rgba(255,255,255,0.10)" />
          <rect x="268" y="154" width="52" height="8" rx="4" fill="rgba(255,255,255,0.14)" />

          <!-- ticket/docs -->
          <g class="vacation-preview__ticket">
            <rect
                x="286"
                y="138"
                width="42"
                height="24"
                rx="8"
                fill="url(#vacation-accent-1)"
                fill-opacity="0.88"
            />
            <rect x="294" y="146" width="18" height="4" rx="2" fill="white" fill-opacity="0.72" />
            <rect x="294" y="153" width="12" height="3" rx="1.5" fill="white" fill-opacity="0.46" />
          </g>

          <!-- progress -->
          <rect
              x="248"
              y="172"
              width="82"
              height="8"
              rx="4"
              fill="rgba(255,255,255,0.08)"
          />
          <rect
              class="vacation-preview__progress"
              x="248"
              y="172"
              width="52"
              height="8"
              rx="4"
              fill="url(#vacation-accent-2)"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.vacation-preview {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vacation-preview__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.vacation-preview__panel {
  transform-origin: center;
  animation: vacationPanelFloat 6s ease-in-out infinite;
}

.vacation-preview__glow {
  opacity: 0.42;
}

.vacation-preview__glow--left {
  animation: vacationGlowLeft 5.6s ease-in-out infinite;
}

.vacation-preview__glow--right {
  animation: vacationGlowRight 6.3s ease-in-out infinite;
}

.vacation-preview__float {
  transform-origin: center;
}

.vacation-preview__float--map {
  animation: vacationMapFloat 5.1s ease-in-out infinite;
}

.vacation-preview__float--checklist {
  animation: vacationChecklistFloat 5.8s ease-in-out infinite;
}

.vacation-preview__badge {
  transform-origin: center;
  animation: vacationBadgeFloat 4.4s ease-in-out infinite;
}

.vacation-preview__route {
  animation: vacationRouteDash 4.8s linear infinite;
}

.vacation-preview__ticket {
  transform-origin: center;
  animation: vacationTicketFloat 4.6s ease-in-out infinite;
}

.vacation-preview__progress {
  animation: vacationProgressPulse 3.8s ease-in-out infinite;
}

@keyframes vacationPanelFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes vacationMapFloat {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-4px) translateX(1px);
  }
}

@keyframes vacationChecklistFloat {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(4px) translateX(-1px);
  }
}

@keyframes vacationBadgeFloat {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.94;
  }
  50% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

@keyframes vacationGlowLeft {
  0%, 100% {
    opacity: 0.28;
    transform: scale(1);
  }
  50% {
    opacity: 0.56;
    transform: scale(1.12);
  }
}

@keyframes vacationGlowRight {
  0%, 100% {
    opacity: 0.24;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.14);
  }
}

@keyframes vacationRouteDash {
  0% {
    stroke-dashoffset: 240;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes vacationTicketFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-2px) rotate(-2deg);
  }
}

@keyframes vacationProgressPulse {
  0%, 100% {
    opacity: 0.88;
    transform: scaleX(1);
    transform-origin: left center;
  }
  50% {
    opacity: 1;
    transform: scaleX(1.04);
    transform-origin: left center;
  }
}
</style>