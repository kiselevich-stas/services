<template>
  <div class="settings-modules-skeleton">
    <div class="settings-modules-skeleton__header">
      <div class="skeleton skeleton--title" />
      <div class="skeleton skeleton--text" />
      <div class="skeleton skeleton--text skeleton--text-short" />
    </div>

    <div class="settings-modules-skeleton__card">
      <div class="settings-modules-skeleton__content">
        <div class="skeleton skeleton--row-title" />
        <div class="skeleton skeleton--row-text" />
      </div>

      <div class="skeleton skeleton--switch" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.settings-modules-skeleton {
  display: grid;
  gap: 20px;
}

.settings-modules-skeleton__header,
.settings-modules-skeleton__card {
  border-radius: 28px;
  background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.012)),
      rgba(18, 27, 43, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 24px;
}

.settings-modules-skeleton__header {
  display: grid;
  gap: 12px;
}

.settings-modules-skeleton__card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.settings-modules-skeleton__content {
  display: grid;
  gap: 10px;
  flex: 1;
}

.skeleton {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
          100deg,
          transparent 20%,
          rgba(255, 255, 255, 0.12) 40%,
          transparent 60%
  );
  animation: skeleton-shimmer 1.2s ease-in-out infinite;
}

.skeleton--title {
  width: 260px;
  height: 28px;
  border-radius: 8px;
}

.skeleton--text {
  width: 420px;
  height: 14px;
}

.skeleton--text-short {
  width: 260px;
}

.skeleton--row-title {
  width: 180px;
  height: 20px;
}

.skeleton--row-text {
  width: 320px;
  height: 14px;
}

.skeleton--switch {
  width: 72px;
  height: 40px;
  border-radius: 999px;
}

@keyframes skeleton-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@media (max-width: 768px) {
  .settings-modules-skeleton__card {
    flex-direction: column;
    align-items: flex-start;
  }

  .skeleton--text,
  .skeleton--text-short,
  .skeleton--row-text {
    width: 100%;
  }
}
</style>