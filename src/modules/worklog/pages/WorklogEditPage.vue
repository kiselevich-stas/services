<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WorklogEntryForm from '../components/WorklogEntryForm.vue'
import { useWorklogStore } from '../store/worklog'
import type { WorkLogInsertPayload } from '../types'

const route = useRoute()
const router = useRouter()
const worklogStore = useWorklogStore()

const worklogId = computed(() => String(route.params.id || ''))

const currentLog = computed(() => {
  return worklogStore.logs.find((log) => log.id === worklogId.value) ?? null
})

const pageTitle = computed(() => {
  return currentLog.value?.project
      ? `Редактирование: ${currentLog.value.project}`
      : 'Редактирование записи'
})

onMounted(async () => {
  if (!worklogStore.logs.length) {
    try {
      await worklogStore.loadLogs()
    } catch {
      return
    }
  }

  if (!currentLog.value) {
    await router.replace('/worklog')
  }
})

async function handleSubmit(payload: WorkLogInsertPayload): Promise<void> {
  if (!currentLog.value) {
    return
  }

  try {
    await worklogStore.updateLog({
      id: currentLog.value.id,
      ...payload,
    })

    await router.push('/worklog')
  } catch {
    // тост уже показан в store
  }
}

async function handleCancel(): Promise<void> {
  await router.push('/worklog')
}
</script>

<template>
  <div class="worklog-edit-page">
    <section class="worklog-edit-hero">
      <p class="worklog-edit-hero__eyebrow">Worklog</p>
      <h1 class="worklog-edit-hero__title">
        {{ pageTitle }}
      </h1>
      <p class="worklog-edit-hero__text">
        Измени дату, количество часов, проект или комментарий и сохрани обновленную запись.
      </p>
    </section>

    <WorklogEntryForm
        v-if="currentLog"
        :model-value="currentLog"
        :loading="worklogStore.saving"
        @submit="handleSubmit"
        @cancel="handleCancel"
    />
  </div>
</template>

<style scoped lang="scss">
.worklog-edit-page {
  display: grid;
  gap: 18px;
}

.worklog-edit-hero {
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

.worklog-edit-hero__eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(236, 72, 153, 0.9);
}

.worklog-edit-hero__title {
  margin: 0;
  font-size: clamp(28px, 3vw, 40px);
  line-height: 1.05;
  color: #fff;
}

.worklog-edit-hero__text {
  margin: 14px 0 0;
  max-width: 760px;
  font-size: 16px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.72);
}

@media (max-width: 720px) {
  .worklog-edit-hero {
    padding: 20px;
  }
}
</style>