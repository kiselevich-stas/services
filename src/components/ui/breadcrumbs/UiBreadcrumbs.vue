<script setup lang="ts">
import { RouterLink } from 'vue-router'

export interface BreadcrumbItem {
  label: string
  to?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<template>
  <nav class="breadcrumbs" aria-label="Хлебные крошки">
    <template v-for="(item, index) in items" :key="index">
      <!-- ссылка -->
      <RouterLink
          v-if="item.to && index !== items.length - 1"
          :to="item.to"
          class="breadcrumbs__link"
      >
        {{ item.label }}
      </RouterLink>

      <!-- текущий -->
      <span v-else class="breadcrumbs__current">
        {{ item.label }}
      </span>

      <!-- разделитель -->
      <span
          v-if="index !== items.length - 1"
          class="breadcrumbs__separator"
      >
        /
      </span>
    </template>
  </nav>
</template>

<style scoped lang="scss">
.breadcrumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.68);

  &__link {
    color: rgba(255, 255, 255, 0.78);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #ffffff;
    }
  }

  &__separator {
    color: rgba(255, 255, 255, 0.35);
  }

  &__current {
    color: #ffffff;
    font-weight: 500;
  }
}
</style>