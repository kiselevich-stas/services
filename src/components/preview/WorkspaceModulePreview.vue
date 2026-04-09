<template>
  <div class="workspace-preview">
    <svg
        class="workspace-preview__svg"
        viewBox="0 0 420 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
            id="workspace-card-bg"
            x1="36"
            y1="28"
            x2="366"
            y2="222"
            gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.22" />
          <stop offset="1" stop-color="#FFFFFF" stop-opacity="0.04" />
        </linearGradient>

        <linearGradient id="workspace-accent-1" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#F472B6" />
          <stop offset="1" stop-color="#A855F7" />
        </linearGradient>

        <linearGradient id="workspace-accent-2" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#60A5FA" />
          <stop offset="1" stop-color="#C084FC" />
        </linearGradient>

        <linearGradient id="workspace-accent-3" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#34D399" />
          <stop offset="1" stop-color="#60A5FA" />
        </linearGradient>

        <filter id="workspace-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      <!-- glow -->
      <circle
          class="workspace-preview__glow workspace-preview__glow--left"
          cx="92"
          cy="62"
          r="42"
          fill="#F472B6"
          filter="url(#workspace-blur)"
      />
      <circle
          class="workspace-preview__glow workspace-preview__glow--right"
          cx="330"
          cy="176"
          r="46"
          fill="#60A5FA"
          filter="url(#workspace-blur)"
      />

      <g class="workspace-preview__panel">
        <!-- main panel -->
        <rect
            x="42"
            y="28"
            width="336"
            height="184"
            rx="28"
            fill="url(#workspace-card-bg)"
            stroke="white"
            stroke-opacity="0.14"
        />

        <!-- header -->
        <rect x="66" y="52" width="126" height="14" rx="7" fill="rgba(255,255,255,0.18)" />
        <rect x="66" y="76" width="96" height="10" rx="5" fill="rgba(255,255,255,0.1)" />

        <!-- workspace room card -->
        <g class="workspace-preview__float workspace-preview__float--room">
          <rect
              x="64"
              y="104"
              width="136"
              height="80"
              rx="22"
              fill="rgba(255,255,255,0.08)"
              stroke="white"
              stroke-opacity="0.08"
          />

          <!-- avatars -->
          <circle cx="90" cy="128" r="12" fill="url(#workspace-accent-1)" />
          <circle cx="118" cy="128" r="12" fill="url(#workspace-accent-2)" fill-opacity="0.95" />
          <circle cx="146" cy="128" r="12" fill="url(#workspace-accent-3)" fill-opacity="0.95" />

          <!-- online dot -->
          <circle cx="160" cy="118" r="4" fill="#34D399" class="workspace-preview__online-dot" />

          <!-- text -->
          <rect x="82" y="148" width="74" height="9" rx="4.5" fill="rgba(255,255,255,0.18)" />
          <rect x="82" y="163" width="50" height="7" rx="3.5" fill="rgba(255,255,255,0.10)" />
        </g>

        <!-- messages card -->
        <g class="workspace-preview__float workspace-preview__float--chat">
          <rect
              x="214"
              y="98"
              width="136"
              height="94"
              rx="22"
              fill="rgba(255,255,255,0.07)"
              stroke="white"
              stroke-opacity="0.08"
          />

          <!-- message bubble 1 -->
          <rect
              x="232"
              y="116"
              width="64"
              height="16"
              rx="8"
              fill="rgba(255,255,255,0.12)"
              class="workspace-preview__bubble workspace-preview__bubble--left"
          />
          <!-- message bubble 2 -->
          <rect
              x="268"
              y="140"
              width="58"
              height="16"
              rx="8"
              fill="url(#workspace-accent-2)"
              class="workspace-preview__bubble workspace-preview__bubble--right"
          />
          <!-- message bubble 3 -->
          <rect
              x="232"
              y="164"
              width="82"
              height="16"
              rx="8"
              fill="rgba(255,255,255,0.10)"
              class="workspace-preview__bubble workspace-preview__bubble--left-2"
          />
        </g>

        <!-- top badge -->
        <g class="workspace-preview__badge">
          <rect
              x="284"
              y="52"
              width="64"
              height="28"
              rx="14"
              fill="rgba(255,255,255,0.08)"
          />
          <circle cx="302" cy="66" r="6" fill="url(#workspace-accent-1)" />
          <rect x="314" y="61" width="20" height="10" rx="5" fill="rgba(255,255,255,0.18)" />
        </g>

        <!-- bottom room tabs -->
        <g class="workspace-preview__tabs">
          <rect x="74" y="194" width="34" height="8" rx="4" fill="rgba(255,255,255,0.08)" />
          <rect x="114" y="194" width="44" height="8" rx="4" fill="url(#workspace-accent-1)" />
          <rect x="164" y="194" width="28" height="8" rx="4" fill="rgba(255,255,255,0.1)" />
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.workspace-preview {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.workspace-preview__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.workspace-preview__panel {
  transform-origin: center;
  animation: panelFloat 6s ease-in-out infinite;
}

.workspace-preview__glow {
  opacity: 0.42;
}

.workspace-preview__glow--left {
  animation: glowPulseLeft 5s ease-in-out infinite;
}

.workspace-preview__glow--right {
  animation: glowPulseRight 6.5s ease-in-out infinite;
}

.workspace-preview__float {
  transform-origin: center;
}

.workspace-preview__float--room {
  animation: roomFloat 4.8s ease-in-out infinite;
}

.workspace-preview__float--chat {
  animation: chatFloat 5.8s ease-in-out infinite;
}

.workspace-preview__badge {
  transform-origin: center;
  animation: badgeFloat 4.2s ease-in-out infinite;
}

.workspace-preview__bubble--left {
  animation: bubbleLeft 4.4s ease-in-out infinite;
}

.workspace-preview__bubble--right {
  animation: bubbleRight 4.8s ease-in-out infinite;
}

.workspace-preview__bubble--left-2 {
  animation: bubbleLeft2 5s ease-in-out infinite;
}


@keyframes panelFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes roomFloat {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(-6px) translateX(2px);
  }
}

@keyframes chatFloat {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(5px) translateX(-2px);
  }
}

@keyframes badgeFloat {
  0%, 100% {
    transform: translateY(0px);
    opacity: 0.95;
  }
  50% {
    transform: translateY(-5px);
    opacity: 1;
  }
}

@keyframes glowPulseLeft {
  0%, 100% {
    opacity: 0.28;
    transform: scale(1);
  }
  50% {
    opacity: 0.52;
    transform: scale(1.12);
  }
}

@keyframes glowPulseRight {
  0%, 100% {
    opacity: 0.24;
    transform: scale(1);
  }
  50% {
    opacity: 0.48;
    transform: scale(1.15);
  }
}

@keyframes bubbleLeft {
  0%, 100% {
    transform: translateX(0);
    opacity: 0.85;
  }
  50% {
    transform: translateX(2px);
    opacity: 1;
  }
}

@keyframes bubbleRight {
  0%, 100% {
    transform: translateX(0);
    opacity: 0.92;
  }
  50% {
    transform: translateX(-2px);
    opacity: 1;
  }
}

@keyframes bubbleLeft2 {
  0%, 100% {
    transform: translateX(0);
    opacity: 0.82;
  }
  50% {
    transform: translateX(1px);
    opacity: 1;
  }
}

@keyframes onlinePulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.85;
  }
  50% {
    transform: scale(1.25);
    opacity: 1;
  }
}
</style>