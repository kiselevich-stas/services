<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import { hockeyPairSchema } from '../composables/useHeadToHead'

const props = defineProps<{
  teamAId: string
  teamBId: string
  stageId: string
  teamOptions: Array<{ label: string; value: string }>
  stageOptions: Array<{ label: string; value: string }>
}>()

const emit = defineEmits<{
  'update:teamAId': [value: string]
  'update:teamBId': [value: string]
  'update:stageId': [value: string]
  submit: []
  swap: []
}>()

const formState = reactive({
  teamAId: props.teamAId,
  teamBId: props.teamBId,
  stageId: props.stageId,
})

watch(
  () => props.teamAId,
  (value) => {
    formState.teamAId = value
  },
)

watch(
  () => props.teamBId,
  (value) => {
    formState.teamBId = value
  },
)

watch(
  () => props.stageId,
  (value) => {
    formState.stageId = value
  },
)

const errors = computed(() => {
  const result = hockeyPairSchema.safeParse(formState)

  if (result.success) {
    return {
      teamAId: '',
      teamBId: '',
      stageId: '',
    }
  }

  const flattened = result.error.flatten().fieldErrors

  return {
    teamAId: flattened.teamAId?.[0] ?? '',
    teamBId: flattened.teamBId?.[0] ?? '',
    stageId: flattened.stageId?.[0] ?? '',
  }
})

function submit(): void {
  const result = hockeyPairSchema.safeParse(formState)

  emit('update:teamAId', formState.teamAId)
  emit('update:teamBId', formState.teamBId)
  emit('update:stageId', formState.stageId)

  if (!result.success) {
    return
  }

  emit('submit')
}
</script>

<template>
  <section class="panel hockey-form">
    <div class="panel__header">
      <h2 class="panel__title">Сравнение двух команд</h2>
      <p class="panel__text">
        Выбери пару клубов и сезон, чтобы увидеть личные встречи, победы, шайбы и последние матчи.
      </p>
    </div>

    <div class="hockey-form__grid">
      <UiSelect
        :model-value="formState.teamAId"
        label="Команда 1"
        placeholder="Выберите первую команду"
        :options="teamOptions"
        :error="errors.teamAId"
        @update:model-value="(value) => formState.teamAId = value"
      />

      <UiSelect
        :model-value="formState.teamBId"
        label="Команда 2"
        placeholder="Выберите вторую команду"
        :options="teamOptions"
        :error="errors.teamBId"
        @update:model-value="(value) => formState.teamBId = value"
      />

      <UiSelect
        :model-value="formState.stageId"
        label="Сезон / стадия"
        placeholder="Выберите стадию"
        :options="stageOptions"
        :error="errors.stageId"
        @update:model-value="(value) => formState.stageId = value"
      />
    </div>

    <div class="hockey-form__actions">
      <UiButton variant="ghost" @click="emit('swap')">
        Поменять местами
      </UiButton>

      <UiButton @click="submit">
        Показать статистику
      </UiButton>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hockey-form {
  display: grid;
  gap: 20px;
}

.hockey-form__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.hockey-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 980px) {
  .hockey-form__grid {
    grid-template-columns: 1fr;
  }

  .hockey-form__actions {
    justify-content: stretch;
    flex-direction: column;
  }
}
</style>
