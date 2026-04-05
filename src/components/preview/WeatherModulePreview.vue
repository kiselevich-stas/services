<script setup lang="ts"></script>

<template>
  <div class="mockup mockup-weather">
    <div class="weather-preview">
      <div class="weather-preview__top">
        <div>
          <div class="weather-preview__city">Saint Petersburg</div>
          <div class="weather-preview__time">Сегодня, 14:00</div>
        </div>

        <div class="weather-preview__temp">+18°</div>
      </div>

      <div class="weather-preview__status">
        <div class="weather-icon">
          <span class="sun" />
          <span class="cloud" />
        </div>

        <div class="weather-info">
          <div class="weather-info__label">Комфорт</div>
          <div class="weather-info__value">Хорошо</div>
        </div>
      </div>

      <div class="weather-chart">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
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

.weather-preview {
  width: 100%;
  border-radius: 24px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(10, 17, 30, 0.72);
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.26);
}

.weather-preview__top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.weather-preview__city {
  font-size: 18px;
  font-weight: 600;
}

.weather-preview__time {
  margin-top: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.54);
}

.weather-preview__temp {
  font-size: 34px;
  font-weight: 700;
  line-height: 1;
}

.weather-preview__status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.weather-icon {
  position: relative;
  width: 92px;
  height: 64px;
}

.sun {
  position: absolute;
  left: 8px;
  top: 2px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: radial-gradient(circle, #fde68a 0%, #f59e0b 75%);
  box-shadow: 0 0 24px rgba(245, 158, 11, 0.32);
}

.cloud {
  position: absolute;
  left: 22px;
  top: 24px;
  width: 50px;
  height: 24px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);

  &::before,
  &::after {
    content: '';
    position: absolute;
    bottom: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.88);
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
}

.weather-info {
  text-align: right;
}

.weather-info__label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.54);
}

.weather-info__value {
  margin-top: 6px;
  font-size: 22px;
  font-weight: 700;
}

.weather-chart {
  display: flex;
  align-items: end;
  gap: 8px;
  height: 80px;

  span {
    flex: 1;
    border-radius: 999px 999px 10px 10px;
    background: linear-gradient(
            to top,
            rgba(56, 189, 248, 0.28),
            rgba(125, 211, 252, 0.92)
    );
  }

  span:nth-child(1) { height: 34px; }
  span:nth-child(2) { height: 52px; }
  span:nth-child(3) { height: 44px; }
  span:nth-child(4) { height: 68px; }
  span:nth-child(5) { height: 58px; }
  span:nth-child(6) { height: 74px; }
}

@media (max-width: 640px) {
  .weather-preview__status {
    align-items: flex-start;
    flex-direction: column;
  }

  .weather-info {
    text-align: left;
  }
}
</style>