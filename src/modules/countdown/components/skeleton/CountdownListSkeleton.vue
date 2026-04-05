<template>
  <div class="countdown-list-skeleton">
    <div
        v-for="i in 3"
        :key="i"
        class="countdown-list-skeleton__item skeleton"
    />
  </div>
</template>

<style scoped lang="scss">
.countdown-list-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__item {
    height: 60px;
    border-radius: 16px;
  }
}

.skeleton {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
    );
    animation: skeleton-shimmer 1.6s infinite;
  }
}

@keyframes skeleton-shimmer {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(120%);
  }
}
</style>