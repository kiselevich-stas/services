<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import UiButton from '../../../components/ui/UiButton.vue'
import UiInput from '../../../components/ui/UiInput.vue'
import WorklogDeleteModal from '../components/WorklogDeleteModal.vue'
import { useWorklogStore } from '../store/worklog'
import type { WorkLog } from '../types'
import UiBreadcrumbs from "../../../components/ui/breadcrumbs/UiBreadcrumbs.vue";

const router = useRouter()
const worklogStore = useWorklogStore()

const search = ref('')
const currentPage = ref(1)
const pageSize = 10
const deletingLog = ref<WorkLog | null>(null)

onMounted(async () => {
  if (!worklogStore.logs.length) {
    try {
      await worklogStore.loadLogs()
    } catch {
      // тост уже показан в store
    }
  }
})

const filteredLogs = computed(() => {
  const query = search.value.trim().toLowerCase()

  if (!query) {
    return worklogStore.sortedLogs
  }

  return worklogStore.sortedLogs.filter((log) => {
    const project = log.project?.toLowerCase() ?? ''
    const note = log.note?.toLowerCase() ?? ''
    const date = log.workDate?.toLowerCase() ?? ''

    return (
        project.includes(query) ||
        note.includes(query) ||
        date.includes(query)
    )
  })
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredLogs.value.length / pageSize))
})

const paginatedLogs = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize
  const endIndex = startIndex + pageSize

  return filteredLogs.value.slice(startIndex, endIndex)
})

watch(search, () => {
  currentPage.value = 1
})

watch(totalPages, (value) => {
  if (currentPage.value > value) {
    currentPage.value = value
  }
})

function formatDate(value: string): string {
  const date = new Date(value)

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function handleEdit(log: WorkLog): void {
  router.push(`/worklog/${log.id}/edit`)
}

function openDeleteModal(log: WorkLog): void {
  deletingLog.value = log
}

function closeDeleteModal(): void {
  deletingLog.value = null
}

async function confirmDelete(): Promise<void> {
  if (!deletingLog.value) {
    return
  }

  const logId = deletingLog.value.id
  deletingLog.value = null

  try {
    await worklogStore.removeLog(logId)
  } catch {
    // тост уже показан в store
  }
}

function goPrevPage(): void {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

function goNextPage(): void {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
  }
}

const breadcrumbs = computed(() => [
  { label: 'Главная', to: '/' },
  { label: 'Worklog', to: '/worklog' },
  { label: 'История worklog' },
])
</script>

<template>
  <div class="worklog-history-page">
    <UiBreadcrumbs :items="breadcrumbs" />
    <section class="worklog-history-page__hero">
      <div>
        <p class="worklog-history-page__eyebrow">Worklog</p>
        <h1 class="worklog-history-page__title">Вся история записей</h1>
        <p class="worklog-history-page__text">
          Поиск по проекту, комментарию и дате. Все записи в одном месте в аккуратном стиле приложения.
        </p>
      </div>

      <div class="worklog-history-page__hero-actions">
        <UiButton variant="secondary" @click="router.push('/worklog')">
          Назад
        </UiButton>

        <UiButton @click="router.push('/worklog/create')">
          Добавить запись
        </UiButton>
      </div>
    </section>

    <section class="worklog-history-search-card">
      <UiInput
          v-model="search"
          label="Поиск"
          type="text"
          placeholder="Например: Services, багфикс, 2026-04-09"
      />
    </section>

    <section class="worklog-history-table-card">
      <div class="worklog-history-table-card__header">
        <div>
          <p class="worklog-history-table-card__eyebrow">История</p>
          <h2 class="worklog-history-table-card__title">Все записи</h2>
        </div>

        <span class="worklog-history-table-card__caption">
          Найдено: {{ filteredLogs.length }}
        </span>
      </div>

      <div v-if="paginatedLogs.length" class="worklog-history-list">
        <article
            v-for="log in paginatedLogs"
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
                :loading="worklogStore.deletingId === log.id"
                :disabled="worklogStore.deletingId === log.id"
                @click="openDeleteModal(log)"
            >
              Удалить
            </UiButton>
          </div>
        </article>
      </div>

      <div v-else class="worklog-empty-state">
        <h3 class="worklog-empty-state__title">Ничего не найдено</h3>
        <p class="worklog-empty-state__text">
          Попробуй изменить поисковый запрос.
        </p>
      </div>

      <div
          v-if="filteredLogs.length"
          class="worklog-history-pagination"
      >
        <UiButton
            variant="ghost"
            :disabled="currentPage === 1"
            @click="goPrevPage"
        >
          Назад
        </UiButton>

        <div class="worklog-history-pagination__info">
          Страница {{ currentPage }} из {{ totalPages }}
        </div>

        <UiButton
            variant="ghost"
            :disabled="currentPage === totalPages"
            @click="goNextPage"
        >
          Вперед
        </UiButton>
      </div>
    </section>

    <WorklogDeleteModal
        :open="Boolean(deletingLog)"
        :title="deletingLog?.project || 'Запись'"
        :loading="worklogStore.deletingId === deletingLog?.id"
        @close="closeDeleteModal"
        @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped lang="scss">
.worklog-history-page {
  display: grid;
  gap: 18px;
}

.worklog-history-page__hero,
.worklog-history-search-card,
.worklog-history-table-card {
  padding: 20px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)),
      rgba(10, 14, 24, 0.9);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(18px);
}

.worklog-history-page__hero {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-end;
}

.worklog-history-page__eyebrow,
.worklog-history-table-card__eyebrow {
  margin: 0 0 6px;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(236, 72, 153, 0.9);
}

.worklog-history-page__title {
  margin: 0;
  font-size: clamp(28px, 3vw, 40px);
  color: #fff;
}

.worklog-history-page__text {
  margin: 10px 0 0;
  max-width: 760px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.6;
}

.worklog-history-page__hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.worklog-history-table-card__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 18px;
}

.worklog-history-table-card__title {
  margin: 0;
  font-size: 24px;
  color: #fff;
}

.worklog-history-table-card__caption {
  color: rgba(255, 255, 255, 0.56);
  font-size: 13px;
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

.worklog-history-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.worklog-history-pagination__info {
  color: rgba(255, 255, 255, 0.72);
  font-size: 14px;
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

@media (max-width: 900px) {
  .worklog-history-page__hero,
  .worklog-history-table-card__header,
  .worklog-history-item {
    grid-template-columns: 1fr;
  }

  .worklog-history-page__hero {
    display: grid;
    align-items: stretch;
  }

  .worklog-history-item__actions,
  .worklog-history-page__hero-actions {
    flex-wrap: wrap;
  }

  .worklog-history-pagination {
    flex-direction: column;
  }
}
</style>