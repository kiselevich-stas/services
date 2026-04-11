<template>
  <UiTooltip
      aria-label="Как считается прогноз ELO"
      position="bottom"
  >
    <template #trigger>
      <span class="match-elo-formula-hint__trigger">
        ?
      </span>
    </template>

    <div class="match-elo-formula-hint">
      <div class="match-elo-formula-hint__title">
        Как считается прогноз ELO
      </div>

      <p class="match-elo-formula-hint__text">
        Прогноз строится на сравнении рейтингов двух команд. Чем выше рейтинг команды относительно соперника,
        тем выше её ожидаемая вероятность победы.
      </p>

      <div class="match-elo-formula-hint__block">
        <div class="match-elo-formula-hint__label">
          1. Домашнее преимущество
        </div>

        <div class="match-elo-formula-hint__formula">
          скорректированный рейтинг хозяев = рейтинг хозяев + {{ homeAdvantage }}
        </div>

        <p class="match-elo-formula-hint__text">
          Хозяева получают небольшой бонус, потому что играют на своей площадке.
        </p>
      </div>

      <div class="match-elo-formula-hint__block">
        <div class="match-elo-formula-hint__label">
          2. Вероятность победы хозяев
        </div>

        <div class="match-elo-formula-hint__formula">
          P(победа хозяев) = 1 / (1 + 10^((рейтинг гостей − скорректированный рейтинг хозяев) / 400))
        </div>
      </div>

      <div class="match-elo-formula-hint__block">
        <div class="match-elo-formula-hint__label">
          3. Вероятность победы гостей
        </div>

        <div class="match-elo-formula-hint__formula">
          P(победа гостей) = 1 − P(победа хозяев)
        </div>
      </div>

      <div class="match-elo-formula-hint__block">
        <div class="match-elo-formula-hint__label">
          Пример
        </div>

        <div class="match-elo-formula-hint__formula">
          {{ exampleHomeRating }} + {{ homeAdvantage }} против {{ exampleAwayRating }}
        </div>

        <p class="match-elo-formula-hint__text">
          Если у хозяев рейтинг {{ exampleHomeRating }}, у гостей {{ exampleAwayRating }}, а бонус дома равен
          {{ homeAdvantage }}, то в формуле хозяева сравниваются как команда с рейтингом
          <strong>{{ exampleAdjustedHomeRating }}</strong> против <strong>{{ exampleAwayRating }}</strong>.
          Поэтому их ожидаемый шанс на победу становится выше.
        </p>
      </div>

      <p class="match-elo-formula-hint__note">
        Это вероятностная модель. Она показывает ожидаемый шанс победы, а не гарантирует исход матча.
      </p>
    </div>
  </UiTooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UiTooltip from "../../../../components/ui/tooltip/UiTooltip.vue";

interface Props {
  homeAdvantage?: number
  exampleHomeRating?: number
  exampleAwayRating?: number
}

const props = withDefaults(defineProps<Props>(), {
  homeAdvantage: 50,
  exampleHomeRating: 1550,
  exampleAwayRating: 1500,
})

const exampleAdjustedHomeRating = computed(() => {
  return props.exampleHomeRating + props.homeAdvantage
})
</script>

<style scoped lang="scss">
.match-elo-formula-hint__trigger {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  transition: background 0.2s ease, transform 0.2s ease;
}

.match-elo-formula-hint__trigger:hover {
  background: rgba(255, 255, 255, 0.14);
  transform: scale(1.04);
}

.match-elo-formula-hint {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.match-elo-formula-hint__title {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.25;
}

.match-elo-formula-hint__block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.match-elo-formula-hint__label {
  color: rgba(255, 255, 255, 0.74);
  font-size: 13px;
  font-weight: 600;
}

.match-elo-formula-hint__text {
  margin: 0;
  color: rgba(255, 255, 255, 0.88);
  font-size: 14px;
  line-height: 1.5;
}

.match-elo-formula-hint__formula {
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: #dbeafe;
  font-size: 13px;
  line-height: 1.45;
  word-break: break-word;
}

.match-elo-formula-hint__note {
  margin: 0;
  color: rgba(255, 255, 255, 0.56);
  font-size: 12px;
  line-height: 1.4;
}
</style>