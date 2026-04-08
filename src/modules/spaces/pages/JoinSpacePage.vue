<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UiBadge from '../components/ui/UiBadge.vue'
import UiButton from '../components/ui/UiButton.vue'
import { useSpacesStore } from '../store/useSpacesStore'

const route = useRoute()
const router = useRouter()
const spacesStore = useSpacesStore()

const isLoading = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

const code = computed(() => {
  const value = route.params.code

  return typeof value === 'string' ? value.trim() : ''
})

const invite = computed(() => spacesStore.currentInvite)
const hasInvite = computed(() => Boolean(invite.value))

async function loadInviteData(inviteCode: string) {
  if (!inviteCode) {
    errorMessage.value = 'Некорректная ссылка приглашения'
    spacesStore.resetCurrentInvite()
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await spacesStore.loadInvite(inviteCode)

    if (!spacesStore.currentInvite) {
      errorMessage.value = 'Ссылка устарела, отключена или введена неверно.'
    }
  } catch (error) {
    errorMessage.value =
        error instanceof Error ? error.message : 'Не удалось загрузить приглашение'
    spacesStore.resetCurrentInvite()
  } finally {
    isLoading.value = false
  }
}

watch(
    code,
    async (newCode) => {
      await loadInviteData(newCode)
    },
    { immediate: true },
)

async function handleJoin() {
  if (!code.value) {
    errorMessage.value = 'Некорректная ссылка приглашения'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const result = await spacesStore.joinByCode(code.value)
    await router.push(`/spaces/${result.spaceId}`)
  } catch (error) {
    errorMessage.value =
        error instanceof Error ? error.message : 'Не удалось вступить в пространство'
  } finally {
    isSubmitting.value = false
  }
}

onBeforeUnmount(() => {
  spacesStore.resetCurrentInvite()
})
</script>

<template>
  <div class="join-page">
    <section v-if="isLoading" class="join-card join-card--empty">
      <h1>Загрузка приглашения...</h1>
      <p>Пожалуйста, подожди немного.</p>
    </section>

    <section
        v-else-if="hasInvite"
        class="join-card"
        :style="{
        background: `linear-gradient(135deg, ${invite?.space?.color || '#4f46e5'}, #111827)`,
      }"
    >
      <UiBadge tone="neutral">Invite</UiBadge>

      <h1>{{ invite?.space?.title || 'Приглашение в пространство' }}</h1>

      <p>
        {{
          invite?.space?.description ||
          'Тебя приглашают присоединиться к пространству.'
        }}
      </p>

      <div class="join-card__actions">
        <UiButton :loading="isSubmitting" @click="handleJoin">
          Вступить
        </UiButton>

        <router-link to="/spaces">
          <UiButton variant="secondary">К списку пространств</UiButton>
        </router-link>
      </div>

      <p v-if="errorMessage" class="join-card__error">
        {{ errorMessage }}
      </p>
    </section>

    <section v-else class="join-card join-card--empty">
      <h1>Приглашение не найдено</h1>
      <p>{{ errorMessage || 'Ссылка устарела, отключена или введена неверно.' }}</p>

      <router-link to="/spaces">
        <UiButton>Открыть пространства</UiButton>
      </router-link>
    </section>
  </div>
</template>

<style scoped lang="scss">
.join-page {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.join-card {
  width: min(100%, 720px);
  padding: 32px;
  border-radius: 32px;
  color: #fff;
  box-shadow: 0 28px 80px rgba(17, 24, 39, 0.16);

  h1 {
    margin: 14px 0 10px;
    font-size: clamp(30px, 4vw, 42px);
  }

  p {
    max-width: 560px;
    line-height: 1.6;
  }
}

.join-card--empty {
  background: #fff;
  color: #111827;
  border: 1px solid #eef2f7;
}

.join-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.join-card__error {
  margin-top: 16px;
  color: #fecaca;
}
</style>