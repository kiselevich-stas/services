<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import UiButton from '../../../components/ui/UiButton.vue'
import UiPageLoader from '../../../components/ui/UiPageLoader.vue'
import { supabase } from '../../../lib/supabase'

import VacationPlanForm from '../components/VacationPlanForm.vue'
import { useCreateVacationPlanMutation } from '../composables/useVacationQueries'
import type { VacationPlanFormValues } from '../types/vacation'

const router = useRouter()
const userId = ref<string | null>(null)

onMounted(async () => {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    console.error(error)
    return
  }

  userId.value = data.user?.id ?? null
})

const createPlanMutation = useCreateVacationPlanMutation(userId)

async function handleSubmit(values: VacationPlanFormValues): Promise<void> {
  const createdPlan = await createPlanMutation.mutateAsync(values)

  await router.push({
    name: 'vacation-details',
    params: { id: createdPlan.id },
  })
}
</script>

<template>
  <div class="vacation-create-page">
    <UiPageLoader
        :visible="createPlanMutation.isPending.value"
        text="Создаём отпуск..."
    />

    <div class="vacation-create-page__back">
      <UiButton variant="ghost" @click="router.push({ name: 'vacation-list' })">
        ← Назад к списку
      </UiButton>
    </div>

    <section class="vacation-create-hero">
      <p class="vacation-create-hero__eyebrow">Vacation Planner</p>
      <h1 class="vacation-create-hero__title">Новый отпуск</h1>
      <p class="vacation-create-hero__text">
        Сначала задай основу: название, даты, настроение и направление поездки.
      </p>
    </section>

    <section class="vacation-create-card">
      <VacationPlanForm
          submit-text="Создать отпуск"
          :loading="createPlanMutation.isPending.value"
          @submit="handleSubmit"
      />
    </section>
  </div>
</template>

<style scoped lang="scss">
.vacation-create-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.vacation-create-page__back {
  display: flex;
  justify-content: flex-start;
}

.vacation-create-hero,
.vacation-create-card {
  padding: 26px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
      radial-gradient(circle at top left, rgba(139, 92, 246, 0.16), transparent 25%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)),
      rgba(10, 14, 24, 0.92);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(18px);
}

.vacation-create-hero__eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(139, 92, 246, 0.9);
}

.vacation-create-hero__title {
  margin: 0;
  font-size: clamp(28px, 3vw, 40px);
  line-height: 1;
  color: #fff;
}

.vacation-create-hero__text {
  margin: 12px 0 0;
  max-width: 720px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}
</style>