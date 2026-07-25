<script setup lang="ts">
defineProps<{
  items: { name: string, position?: string, contact?: string }[]
}>()
</script>

<template>
  <div class="cv-references">
    <div
      v-for="(ref, i) in items"
      :key="i"
      class="cv-references__item"
    >
      <span class="cv-references__name">{{ ref.name }}</span>
      <span
        v-if="ref.position"
        class="cv-references__position"
      >{{ ref.position }}</span>
      <span
        v-if="ref.contact"
        class="cv-references__contact"
      >{{ ref.contact }}</span>
    </div>
  </div>
</template>

<style scoped>
.cv-references {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}
.cv-references__item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}
.cv-references__name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ui-text-highlighted, #111827);
}
.cv-references__position {
  font-size: 0.8125rem;
  color: var(--ui-text-muted, #6b7280);
}
.cv-references__contact {
  font-size: 0.8125rem;
  color: var(--ui-text-toned, #4b5563);
  font-variant-numeric: tabular-nums;
}
</style>
