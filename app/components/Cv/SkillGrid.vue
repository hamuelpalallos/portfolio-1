<script setup lang="ts">
interface SkillItem {
  name: string
  highlight?: boolean
}
interface SkillGroup {
  category: string
  items: Array<string | SkillItem>
}
defineProps<{
  items: SkillGroup[]
  languages?: string[]
}>()

const normalize = (item: string | SkillItem): SkillItem =>
  typeof item === 'string' ? { name: item } : item
</script>

<template>
  <div class="cv-skills">
    <div
      v-for="group in items"
      :key="group.category"
      class="cv-skills__group"
    >
      <h3 class="cv-skills__category">
        {{ group.category }}
      </h3>
      <p class="cv-skills__items">
        <template
          v-for="(skill, i) in group.items.map(normalize)"
          :key="skill.name"
        >
          <span
            :class="['cv-skills__chip', skill.highlight ? 'cv-skills__chip--strong' : '']"
          >{{ skill.name }}</span><span
            v-if="i < group.items.length - 1"
            class="cv-skills__sep"
          > · </span>
        </template>
      </p>
    </div>

    <div
      v-if="languages?.length"
      class="cv-skills__group"
    >
      <h3 class="cv-skills__category">
        Spoken languages
      </h3>
      <p class="cv-skills__items">
        {{ languages.join(' · ') }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.cv-skills {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem 1.5rem;
}
.cv-skills__group {
  display: flex;
  flex-direction: column;
  gap: 0.1875rem;
}
.cv-skills__category {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ui-text-highlighted, #111827);
  margin: 0;
}
.cv-skills__items {
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--ui-text-toned, #4b5563);
  margin: 0;
}
.cv-skills__chip--strong {
  font-weight: 600;
  color: var(--ui-text-highlighted, #111827);
}
.cv-skills__sep {
  color: var(--ui-border-accented, #d1d5db);
}
</style>
