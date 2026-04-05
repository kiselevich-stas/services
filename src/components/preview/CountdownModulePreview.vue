<script setup lang="ts"></script>

<template>
  <div class="mockup mockup-countdown">
    <div class="mockup-window">
      <div class="mockup-window__top">
        <span class="dot" />
        <span class="dot" />
        <span class="dot" />
      </div>

      <div class="countdown-preview">
        <div class="countdown-preview__badge">
          Active countdown
        </div>

        <div class="countdown-preview__title">
          До отпуска
        </div>

        <div class="countdown-preview__timer">
          <div class="timer-item">
            <span class="timer-value">12</span>
            <span class="timer-label">дней</span>
          </div>

          <div class="timer-item">
            <span class="timer-value">08</span>
            <span class="timer-label">часов</span>
          </div>

          <div class="timer-item">
            <span class="timer-value">24</span>
            <span class="timer-label">минут</span>
          </div>
        </div>

        <div class="countdown-preview__footer">
          <span class="mini-pill" />
          <span class="mini-pill mini-pill--wide" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mockup {
  width: 100%;
  max-width: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mockup-window {
  width: 100%;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(8, 12, 24, 0.72);
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
}

.mockup-window__top {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.32);
}

.countdown-preview {
  padding: 20px;
}

.countdown-preview__badge {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: #ddd6fe;
  background: rgba(139, 92, 246, 0.16);
  border: 1px solid rgba(139, 92, 246, 0.2);
  margin-bottom: 16px;
}

.countdown-preview__title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 18px;
}

.countdown-preview__timer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.timer-item {
  padding: 16px 10px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  text-align: center;
}

.timer-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
}

.timer-label {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.56);
}

.countdown-preview__footer {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.mini-pill {
  display: block;
  width: 48px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
}

.mini-pill--wide {
  width: 88px;
}

@media (max-width: 640px) {
  .countdown-preview__timer {
    grid-template-columns: 1fr;
  }
}
</style>