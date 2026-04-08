<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InviteLinkModal from '../components/InviteLinkModal.vue'
import SpaceHero from '../components/SpaceHero.vue'
import SpaceMeetingsTimeline from '../components/SpaceMeetingsTimeline.vue'
import SpaceMembersSection from '../components/SpaceMembersSection.vue'
import { useSpacesStore } from '../store/useSpacesStore'

const route = useRoute()
const router = useRouter()
const spacesStore = useSpacesStore()
const isInviteModalOpen = ref(false)

const spaceId = computed(() => String(route.params.id))

onMounted(() => {
  void spacesStore.loadSpaceById(spaceId.value)
})

onUnmounted(() => {
  spacesStore.resetCurrentSpace()
})

function handleCreateMeeting() {
  router.push(`/meetings/new?spaceId=${spaceId.value}`)
}
</script>

<template>
  <div class="page-shell">
    <div v-if="spacesStore.isLoading || !spacesStore.currentSpace" class="page-state">Загружаем пространство…</div>

    <template v-else>
      <SpaceHero
        :space="spacesStore.currentSpace.space"
        @create-meeting="handleCreateMeeting"
        @open-invite="isInviteModalOpen = true"
      />

      <div class="space-layout">
        <SpaceMembersSection :members="spacesStore.currentSpace.members" />
      </div>

      <InviteLinkModal
        :open="isInviteModalOpen"
        :space-id="spacesStore.currentSpace.space.id"
        :current-code="spacesStore.currentSpace.activeInvite?.code ?? null"
        @close="isInviteModalOpen = false"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.page-shell {
  display: grid;
  gap: 24px;
  padding: 24px;
}
.space-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.7fr);
  gap: 20px;
  align-items: start;
}
.page-state {
  padding: 30px;
  border-radius: 28px;
  background: #fff;
  border: 1px solid #eef2f7;
  text-align: center;
}
</style>
