<script setup lang="ts">
defineProps<{
  items: Array<{ id: string; first_name: string | null; last_name: string | null; avatar_url: string | null; email: string | null }>
}>()

function getInitials(firstName?: string | null, lastName?: string | null, email?: string | null): string {
  const fallback = email?.[0]?.toUpperCase() ?? '?'
  const first = firstName?.[0]?.toUpperCase() ?? ''
  const last = lastName?.[0]?.toUpperCase() ?? ''

  return `${first}${last}` || fallback
}
</script>

<template>
  <div class="avatar-stack">
    <div v-for="item in items" :key="item.id" class="avatar-stack__item">
      <img v-if="item.avatar_url" :src="item.avatar_url" :alt="item.first_name ?? 'avatar'">
      <span v-else>{{ getInitials(item.first_name, item.last_name, item.email) }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.avatar-stack {
  display: flex;
}
.avatar-stack__item {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  overflow: hidden;
  border: 2px solid #fff;
  background: #e5e7eb;
  margin-left: -10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #111827;

  &:first-child {
    margin-left: 0;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
