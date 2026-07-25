<script setup lang="ts">
interface ExperienceEntry {
  position: string
  company: string
  period: string
  location?: string
  description?: string
  achievements?: string[]
}
defineProps<{
  items: ExperienceEntry[]
}>()
</script>

<template>
  <div class="cv-experience">
    <article
      v-for="(item, index) in items"
      :key="index"
      class="cv-experience__item"
    >
      <div class="cv-experience__head">
        <div class="cv-experience__heading">
          <h3 class="cv-experience__role">
            {{ item.position }}
          </h3>
          <div
            v-if="item.company || item.location"
            class="cv-experience__meta"
          >
            <span
              v-if="item.company"
              class="cv-experience__company"
            >{{ item.company }}</span>
            <span
              v-if="item.company && item.location"
              class="cv-experience__sep"
            >·</span>
            <span
              v-if="item.location"
              class="cv-experience__location"
            >{{ item.location }}</span>
          </div>
        </div>
        <span
          v-if="item.period"
          class="cv-experience__period"
        >{{ item.period }}</span>
      </div>

      <p
        v-if="item.description"
        class="cv-experience__desc"
      >
        {{ item.description }}
      </p>

      <ul
        v-if="item.achievements?.length"
        class="cv-experience__list"
      >
        <li
          v-for="(a, i) in item.achievements"
          :key="i"
        >
          {{ a }}
        </li>
      </ul>
    </article>
  </div>
</template>

<style scoped>
.cv-experience {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
}
.cv-experience__item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.cv-experience__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.cv-experience__heading {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}
.cv-experience__role {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--ui-text-highlighted, #111827);
  margin: 0;
  line-height: 1.3;
}
.cv-experience__meta {
  font-size: 0.8125rem;
  color: var(--ui-text-muted, #6b7280);
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  align-items: center;
}
.cv-experience__company {
  font-weight: 500;
  color: var(--ui-text-toned, #4b5563);
}
.cv-experience__sep {
  color: var(--ui-border-accented, #d1d5db);
}
.cv-experience__period {
  font-size: 0.8125rem;
  color: var(--ui-text-muted, #6b7280);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.cv-experience__desc {
  font-size: 0.8125rem;
  color: var(--ui-text-toned, #4b5563);
  line-height: 1.55;
  margin: 0;
}
.cv-experience__list {
  margin: 0.125rem 0 0;
  padding-left: 1.125rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.cv-experience__list li {
  font-size: 0.8125rem;
  line-height: 1.55;
  color: var(--ui-text-toned, #4b5563);
}
</style>
