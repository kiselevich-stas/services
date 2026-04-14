<script setup lang="ts">
import {computed, onMounted} from 'vue'
import { useRouter } from 'vue-router'

import WorklogEntryForm from '../components/WorklogEntryForm.vue'

import { useWorklogStore } from '../store/worklog'
import { useProjectStore } from '../store/project'

import type { WorkLogInsertPayload } from '../types'
import UiBreadcrumbs from "../../../components/ui/breadcrumbs/UiBreadcrumbs.vue";

const router = useRouter()

const worklogStore = useWorklogStore()
const projectStore = useProjectStore()

async function handleSubmit(payload: WorkLogInsertPayload): Promise<void> {
  try {
    await worklogStore.addLog(payload)
    await router.push('/worklog')
  } catch {
    // тост уже показан в store
  }
}

async function handleCancel(): Promise<void> {
  await router.push('/worklog')
}

onMounted(async () => {
  try {
    await projectStore.loadProjects()
  } catch {
    // тост уже показан
  }
})


const breadcrumbs = computed(() => [
  { label: 'Главная', to: '/' },
  { label: 'Worklog', to: '/worklog' },
  { label: 'Создание worklog' },
])

</script>

<template>
  <div class="worklog-create-page">
    <UiBreadcrumbs :items="breadcrumbs" />
    <section class="worklog-create-hero">
      <p class="worklog-create-hero__eyebrow">Worklog</p>
      <h1 class="worklog-create-hero__title">Добавить потраченное время</h1>
      <p class="worklog-create-hero__text">
        Заполни все поля формы, чтобы сохранить новую запись по рабочим часам.
      </p>
    </section>

    <!-- 👇 важно: ждём загрузку проектов -->
    <WorklogEntryForm
        :loading="worklogStore.saving"
        @submit="handleSubmit"
        @cancel="handleCancel"
    />

  </div>
</template>

<style scoped lang="scss">
.worklog-create-page {
  display: grid;
  gap: 18px;
}

.worklog-create-hero {
  padding: 28px;
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
      radial-gradient(circle at top left, rgba(236, 72, 153, 0.2), transparent 26%),
      radial-gradient(circle at bottom right, rgba(6, 182, 212, 0.18), transparent 24%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)),
      rgba(10, 14, 24, 0.92);
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(18px);
}

.worklog-create-hero__eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(236, 72, 153, 0.9);
}

.worklog-create-hero__title {
  margin: 0;
  font-size: clamp(28px, 3vw, 40px);
  line-height: 1.05;
  color: #fff;
}

.worklog-create-hero__text {
  margin: 14px 0 0;
  max-width: 760px;
  font-size: 16px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.72);
}

.worklog-empty {
  padding: 24px;
  border-radius: 24px;
  text-align: center;
}

.worklog-empty__title {
  color: #fff;
  font-size: 20px;
  margin-bottom: 8px;
}

.worklog-empty__text {
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 720px) {
  .worklog-create-hero {
    padding: 20px;
  }
}
</style>