<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="not-found">
    <h1 class="title">404</h1>
    <p class="text">Страница не найдена</p>

    <button class="btn" @click="goHome">
      На главную
    </button>
  </div>
</template>

<style scoped lang="scss">
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
}

.title {
  font-size: 64px;
  font-weight: bold;
}

.text {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
}

.btn {
  padding: 10px 16px;
  border-radius: 10px;
  background: #8b5cf6;
  color: white;
  border: none;
  cursor: pointer;
}
</style>