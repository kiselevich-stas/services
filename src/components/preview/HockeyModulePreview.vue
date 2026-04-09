<template>
  <div class="hockey-preview">
    <div class="hockey-preview__top">
      <div class="hockey-preview__badge">KHL</div>
      <div class="hockey-preview__vs">VS</div>
    </div>

    <div class="hockey-preview__score-row">
      <div class="hockey-preview__score-card">
        <span>Локомотив</span>
        <strong>12</strong>
        <small>побед</small>
      </div>
      <div class="hockey-preview__score-card">
        <span>СКА</span>
        <strong>9</strong>
        <small>побед</small>
      </div>
    </div>

    <div class="hockey-preview__chart">
      <span style="height: 48%" />
      <span style="height: 70%" />
      <span style="height: 56%" />
      <span style="height: 82%" />
      <span style="height: 64%" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.hockey-preview {
  min-height: 220px;
  padding: 18px;
  border-radius: 24px;
  background:
    radial-gradient(circle at top left, rgba(56, 189, 248, 0.18), transparent 34%),
    radial-gradient(circle at bottom right, rgba(236, 72, 153, 0.14), transparent 36%),
    rgba(255, 255, 255, 0.05);
  display: grid;
  align-content: space-between;
  gap: 18px;
}

.hockey-preview__top,
.hockey-preview__score-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.hockey-preview__badge,
.hockey-preview__vs {
  border-radius: 999px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.08);
  font-weight: 700;
}

.hockey-preview__score-card {
  flex: 1;
  border-radius: 18px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.06);
  display: grid;
  gap: 8px;

  strong {
    font-size: 30px;
  }

  small {
    color: rgba(246, 248, 255, 0.65);
  }
}

.hockey-preview__chart {
  display: flex;
  align-items: end;
  gap: 10px;
  height: 72px;

  span {
    display: block;
    flex: 1;
    border-radius: 999px 999px 10px 10px;
    background: linear-gradient(180deg, rgba(56, 189, 248, 0.95), rgba(139, 92, 246, 0.8));
  }
}
</style>
