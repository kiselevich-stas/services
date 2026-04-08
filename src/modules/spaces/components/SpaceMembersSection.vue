<script setup lang="ts">
import UiBadge from './ui/UiBadge.vue'
import type { SpaceMember } from '../types/spaces.types'

defineProps<{
  members: SpaceMember[]
}>()

function getDisplayName(member: SpaceMember): string {
  const firstName = member.profile?.first_name ?? ''
  const lastName = member.profile?.last_name ?? ''
  const fullName = `${firstName} ${lastName}`.trim()

  return fullName || member.profile?.email || 'Участник'
}

function getInitials(member: SpaceMember): string {
  const first = member.profile?.first_name?.[0] ?? ''
  const last = member.profile?.last_name?.[0] ?? ''
  return `${first}${last}`.toUpperCase() || (member.profile?.email?.[0]?.toUpperCase() ?? '?')
}
</script>

<template>
  <section class="space-block">
    <div class="space-block__header">
      <h2>Участники</h2>
      <span>{{ members.length }}</span>
    </div>

    <div class="members-grid">
      <article v-for="member in members" :key="member.id" class="member-card">
        <div class="member-card__avatar">
          <img v-if="member.profile?.avatar_url" :src="member.profile.avatar_url" :alt="getDisplayName(member)">
          <span v-else>{{ getInitials(member) }}</span>
        </div>

        <div class="member-card__content">
          <strong>{{ getDisplayName(member) }}</strong>
          <small>{{ member.profile?.email || 'Без email' }}</small>
        </div>

        <UiBadge :tone="member.role === 'owner' ? 'success' : 'neutral'">
          {{ member.role }}
        </UiBadge>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
.space-block {
  padding: 24px;
  border-radius: 28px;
  background: #fff;
  border: 1px solid #eef2f7;
  box-shadow: 0 16px 40px rgba(17, 24, 39, .05);
}
.space-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;

  h2 {
    margin: 0;
    font-size: 20px;
  }

  span {
    color: #6b7280;
    font-weight: 700;
  }
}
.members-grid {
  display: grid;
  gap: 12px;
}
.member-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border-radius: 18px;
  background: #f9fafb;
}
.member-card__avatar {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  overflow: hidden;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.member-card__content {
  flex: 1;
  display: grid;
  gap: 4px;

  strong {
    font-size: 14px;
    color: #111827;
  }

  small {
    color: #6b7280;
  }
}
</style>
