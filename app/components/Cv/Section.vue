<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <section class="cv-section">
    <h2 class="cv-section__title">
      {{ title }}
    </h2>
    <div class="cv-section__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.cv-section {
  margin-top: 1.75rem;
}
.cv-section:first-child {
  margin-top: 0;
}
.cv-section__title {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ui-text-muted, #6b7280);
  margin: 0 0 0.75rem;
  padding-bottom: 0.375rem;
  border-bottom: 1px solid var(--ui-border-muted, #eceef1);
}
.cv-section__body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
