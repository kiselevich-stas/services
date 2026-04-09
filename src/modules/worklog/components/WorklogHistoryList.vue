<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import UiButton from '../../../components/ui/UiButton.vue'
import WorklogDeleteModal from './WorklogDeleteModal.vue'
import type { WorkLog } from '../types'

const props = defineProps<{
  logs: WorkLog[]
  deletingId?: string | null
}>()

const emit = defineEmits<{
  remove: [id: string]
}>()

const router = useRouter()

const visibleLogs = computed(() => props.logs.slice(0, 10))
const hasMoreLogs = computed(() => props.logs.length > 10)
const deletingLog = ref<WorkLog | null>(null)

function formatDate(value: string): string {
  const date = new Date(value)

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function openDeleteModal(log: WorkLog): void {
  deletingLog.value = log
}

function closeDeleteModal(): void {
  deletingLog.value = null
}

function confirmDelete(): void {
  if (!deletingLog.value) {
    return
  }

  const logId = deletingLog.value.id
  deletingLog.value = null
  emit('remove', logId)
}

function handleEdit(log: WorkLog): void {
  router.push(`/worklog/${log.id}/edit`)
}

function goToHistory(): void {
  router.push('/worklog/history')
}
</script>

<template>
  <section class="worklog-history-card">
    <div class="worklog-history-card__header">
      <div>
        <p class="worklog-history-card__eyebrow">История</p>
        <h2 class="worklog-history-card__title">Последние записи</h2>
      </div>

      <span class="worklog-history-card__caption">
        Привязка к текущему профилю пользователя
      </span>
    </div>

    <div v-if="visibleLogs.length" class="worklog-history-list">
      <article
          v-for="log in visibleLogs"
          :key="log.id"
          class="worklog-history-item"
      >
        <div class="worklog-history-item__meta">
          <div class="worklog-history-item__project-row">
            <strong class="worklog-history-item__project">
              {{ log.project || 'Без проекта' }}
            </strong>

            <span class="worklog-history-item__badge">
              {{ log.hours }} ч
            </span>
          </div>

          <p class="worklog-history-item__date">
            {{ formatDate(log.workDate) }}
          </p>

          <p v-if="log.note" class="worklog-history-item__note">
            {{ log.note }}
          </p>
        </div>

        <div class="worklog-history-item__actions">
          <UiButton
              variant="secondary"
              size="sm"
              @click="handleEdit(log)"
          >
            Изменить
          </UiButton>

          <UiButton
              variant="danger"
              size="sm"
              :loading="deletingId === log.id"
              :disabled="deletingId === log.id"
              @click="openDeleteModal(log)"
          >
            Удалить
          </UiButton>
        </div>
      </article>
    </div>

    <div v-else class="worklog-empty-state">
      <h3 class="worklog-empty-state__title">Пока пусто</h3>
      <p class="worklog-empty-state__text">
        Добавь первую запись, и модуль сразу построит статистику и анимированные графики.
      </p>
    </div>

    <div
        v-if="hasMoreLogs"
        class="worklog-history-card__footer"
    >
      <UiButton variant="ghost" @click="goToHistory">
        Вся история
      </UiButton>
    </div>

    <WorklogDeleteModal
        :open="Boolean(deletingLog)"
        :title="deletingLog?.project || 'Запись'"
        :loading="deletingId === deletingLog?.id"
        @close="closeDeleteModal"
        @confirm="confirmDelete"
    />
  </section>
</template>

<style scoped lang="scss">
.worklog-history-card {
  padding: 20px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)),
      rgba(10, 14, 24, 0.9);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(18px);
}

.worklog-history-card__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 18px;
}

.worklog-history-card__eyebrow {
  margin: 0 0 6px;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(236, 72, 153, 0.9);
}

.worklog-history-card__title {
  margin: 0;
  font-size: 24px;
  color: #fff;
}

.worklog-history-card__caption {
  color: rgba(255, 255, 255, 0.56);
  font-size: 13px;
}

.worklog-history-card__footer {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}

.worklog-history-list {
  display: grid;
  gap: 12px;
}

.worklog-history-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  padding: 16px;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.04);
}

.worklog-history-item__project-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.worklog-history-item__project {
  font-size: 16px;
  color: #fff;
}

.worklog-history-item__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(139, 92, 246, 0.18);
  color: #e9ddff;
  font-size: 13px;
}

.worklog-history-item__date {
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.worklog-history-item__note {
  margin: 10px 0 0;
  color: rgba(255, 255, 255, 0.76);
  line-height: 1.5;
  white-space: pre-wrap;
}

.worklog-history-item__actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.worklog-empty-state {
  padding: 28px 12px 16px;
  text-align: center;
}

.worklog-empty-state__title {
  margin: 0;
  font-size: 22px;
  color: #fff;
}

.worklog-empty-state__text {
  margin: 10px auto 0;
  max-width: 520px;
  color: rgba(255, 255, 255, 0.68);
  line-height: 1.6;
}

@media (max-width: 820px) {
  .worklog-history-card__header,
  .worklog-history-item {
    grid-template-columns: 1fr;
  }

  .worklog-history-item__actions {
    flex-wrap: wrap;
  }
}
</style>