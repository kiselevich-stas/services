<script setup lang="ts">
defineProps<{
  canRecalculate: boolean
  isLoading: boolean
  seasonLabel: string
}>()

const emit = defineEmits<{
  recalculate: []
}>()
</script>

<template>
  <section class="elo-empty-state">
    <div class="elo-empty-state__inner">
      <div class="elo-empty-state__badge">Elo rating</div>

      <h2 class="elo-empty-state__title">
        Для сезона {{ seasonLabel }} рейтинг пока не рассчитан
      </h2>

      <p class="elo-empty-state__text">
        После расчёта здесь появится таблица команд, их текущий Elo-рейтинг,
        количество матчей, побед и поражений.
      </p>

      <div class="elo-empty-state__mock">
        <div
            v-for="item in 6"
            :key="item"
            class="elo-empty-state__mock-row"
        >
          <span class="elo-empty-state__mock-rank" />
          <span class="elo-empty-state__mock-team" />
          <span class="elo-empty-state__mock-score" />
        </div>
      </div>

      <button
          v-if="canRecalculate"
          class="elo-empty-state__button"
          type="button"
          :disabled="isLoading"
          @click="emit('recalculate')"
      >
        {{ isLoading ? 'Рассчитываем...' : 'Рассчитать рейтинг текущего сезона' }}
      </button>

      <p v-else class="elo-empty-state__hint">
        Запустить пересчёт можно только для текущего активного сезона.
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.elo-empty-state {
  border-radius: 28px;
  padding: 1px;
  background: linear-gradient(
          135deg,
          rgba(90, 97, 255, 0.35),
          rgba(0, 212, 170, 0.18),
          rgba(255, 255, 255, 0.08)
  );
}

.elo-empty-state__inner {
  padding: 32px;
  border-radius: 27px;
  background:
      radial-gradient(circle at top right, rgba(90, 97, 255, 0.14), transparent 30%),
      radial-gradient(circle at bottom left, rgba(0, 212, 170, 0.12), transparent 30%),
      #0f172a;
}

.elo-empty-state__badge {
  display: inline-flex;
  margin-bottom: 16px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.elo-empty-state__title {
  margin: 0 0 12px;
  color: #f8fafc;
  font-size: 32px;
  line-height: 1.1;
}

.elo-empty-state__text {
  max-width: 760px;
  margin: 0 0 24px;
  color: #94a3b8;
  font-size: 15px;
  line-height: 1.65;
}

.elo-empty-state__mock {
  display: grid;
  gap: 12px;
  margin-bottom: 24px;
}

.elo-empty-state__mock-row {
  display: grid;
  grid-template-columns: 44px 1fr 100px;
  gap: 12px;
  align-items: center;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}

.elo-empty-state__mock-rank,
.elo-empty-state__mock-team,
.elo-empty-state__mock-score {
  display: block;
  height: 14px;
  border-radius: 999px;
  background: linear-gradient(
          90deg,
          rgba(255,255,255,0.06),
          rgba(255,255,255,0.16),
          rgba(255,255,255,0.06)
  );
}

.elo-empty-state__mock-team {
  width: 68%;
}

.elo-empty-state__button {
  border: none;
  border-radius: 16px;
  padding: 14px 20px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.elo-empty-state__button:disabled {
  opacity: 0.75;
  cursor: default;
}

.elo-empty-state__hint {
  margin: 0;
  color: #94a3b8;
  font-size: 14px;
}
</style>