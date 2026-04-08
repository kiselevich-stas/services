<script setup lang="ts">
import SpaceForm from '../components/SpaceForm.vue'
</script>

<template>
  <div class="page-shell">
    <section class="create-space-hero">
      <span>New space</span>
      <h1>Создай пространство для своей компании</h1>
      <p>Люди не исчезают после одной встречи. Они остаются внутри пространства, а ты создаёшь для них новые события и приглашения.</p>
    </section>

    <SpaceForm />
  </div>
</template>

<style scoped lang="scss">
.page-shell {
  display: grid;
  gap: 24px;
  padding: 24px;
}
.create-space-hero {
  padding: 28px;
  border-radius: 32px;
  background: linear-gradient(135deg, #ec4899, #111827);
  color: #fff;

  span {
    display: inline-block;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,.16);
    font-size: 12px;
    font-weight: 700;
  }

  h1 {
    margin: 12px 0 10px;
    font-size: clamp(30px, 4vw, 42px);
  }

  p {
    margin: 0;
    max-width: 760px;
    color: rgba(255,255,255,.84);
    line-height: 1.6;
  }
}
</style>
