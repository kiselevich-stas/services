<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import CreateSpaceModal from '../components/CreateSpaceModal.vue'
import { useSpacesStore } from '../store/useSpacesStore'

const spacesStore = useSpacesStore()
const isCreateModalOpen = ref(false)

onMounted(async () => {
  await spacesStore.loadSpaces()
})
</script>

<template>
  <div class="page-shell">
    <header class="page-header">
      <div>
        <h1>Пространства</h1>
        <p>Создавай сообщества, приглашай людей и запускай события с голосованием.</p>
      </div>

      <button class="primary-button" @click="isCreateModalOpen = true">Создать пространство</button>
    </header>

    <section v-if="spacesStore.isLoading" class="empty-state">
      <h2>Загрузка пространств...</h2>
    </section>

    <section v-else-if="!spacesStore.hasSpaces" class="empty-state">
      <h2>Пока нет пространств</h2>
      <p>Создай первое пространство и пригласи участников по ссылке.</p>
    </section>

    <section v-else class="spaces-grid">
      <RouterLink
          v-for="space in spacesStore.spaces"
          :key="space.id"
          :to="`/spaces/${space.id}`"
          class="space-card"
          :style="{ background: `linear-gradient(135deg, ${space.color}, #111827)` }"
      >
        <div class="space-card__top">
          <span class="pill">{{ space.visibility }}</span>
          <span class="pill">{{ space.members_count }} участников</span>
        </div>

        <div>
          <h3>{{ space.title }}</h3>
          <p>{{ space.description || 'Описание пока не добавлено.' }}</p>
        </div>
      </RouterLink>
    </section>

    <CreateSpaceModal :open="isCreateModalOpen" @close="isCreateModalOpen = false" />
  </div>
</template>

<style scoped>
.page-shell { display: grid; gap: 24px; padding: 24px; }
.page-header { display: flex; justify-content: space-between; gap: 16px; align-items: end; flex-wrap: wrap; }
.page-header h1 { margin: 0 0 8px; font-size: clamp(34px, 5vw, 48px); }
.page-header p { margin: 0; color: #475569; max-width: 720px; }
.spaces-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; }
.space-card { min-height: 220px; color: #fff; text-decoration: none; padding: 22px; border-radius: 28px; display: flex; flex-direction: column; justify-content: space-between; gap: 18px; box-shadow: 0 24px 50px rgba(15,23,42,.14); }
.space-card__top { display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.space-card h3 { margin: 0 0 8px; font-size: 26px; }
.space-card p { margin: 0; line-height: 1.6; color: rgba(255,255,255,.88); }
.pill { background: rgba(255,255,255,.16); border-radius: 999px; padding: 8px 12px; font-size: 13px; }
.empty-state { padding: 40px; background: #fff; border-radius: 28px; border: 1px solid #e2e8f0; }
.primary-button { border: none; border-radius: 16px; background: #111827; color: #fff; padding: 13px 18px; font: inherit; cursor: pointer; }
</style>
