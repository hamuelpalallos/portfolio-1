<script setup lang="ts">
defineProps<{
  items: { label: string, value: string }[]
}>()
</script>

<template>
  <dl class="cv-metrics">
    <div
      v-for="(metric, i) in items"
      :key="i"
      class="cv-metrics__item"
    >
      <dt class="cv-metrics__label">
        {{ metric.label }}
      </dt>
      <dd class="cv-metrics__value">
        {{ metric.value }}
      </dd>
    </div>
  </dl>
</template>

<style scoped>
.cv-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.625rem;
  margin: 0;
}
.cv-metrics__item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.625rem 0.75rem;
  border-radius: 0.5rem;
  background: var(--ui-bg-elevated, #f6f7f9);
  border: 1px solid var(--ui-border-muted, #eceef1);
}
.cv-metrics__label {
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ui-text-muted, #6b7280);
  margin: 0;
}
.cv-metrics__value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ui-text-highlighted, #111827);
  margin: 0;
  line-height: 1.25;
}

@media (min-width: 640px) {
  .cv-metrics {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
