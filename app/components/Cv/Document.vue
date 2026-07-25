<script setup lang="ts">
import type { CvCollectionItem } from '@nuxt/content'

defineProps<{
  page: CvCollectionItem
}>()
</script>

<template>
  <article
    id="cv-document"
    class="cv-document"
  >
    <CvHeader
      :name="page.profile.name"
      :title="page.profile.title"
      :avatar="page.profile.avatar"
      :contact="page.profile.contact"
    />

    <CvSection title="Profile">
      <p class="cv-document__summary">
        {{ page.summary }}
      </p>
    </CvSection>

    <CvSection title="Professional Experience">
      <CvExperience :items="page.experience" />
    </CvSection>

    <CvSection
      v-if="page.projects?.length"
      title="Selected Projects"
    >
      <CvExperience
        :items="page.projects.map(p => ({
          position: p.name,
          company: '',
          period: p.period || '',
          description: p.description
        }))"
      />
    </CvSection>

    <CvSection title="Skills">
      <CvSkillGrid
        :items="page.skills"
        :languages="page.languages"
      />
    </CvSection>

    <CvSection title="Education">
      <div class="cv-document__education">
        <div
          v-for="(edu, i) in page.education"
          :key="i"
          class="cv-document__edu-item"
        >
          <div class="cv-document__edu-head">
            <span class="cv-document__edu-degree">{{ edu.degree }}</span>
            <span
              v-if="edu.period"
              class="cv-document__edu-period"
            >{{ edu.period }}</span>
          </div>
          <span class="cv-document__edu-inst">{{ edu.institution }}</span>
        </div>
      </div>
    </CvSection>

    <CvSection
      v-if="page.references?.length"
      title="References"
    >
      <CvReferences :items="page.references" />
    </CvSection>
  </article>
</template>

<style scoped>
.cv-document {
  display: flex;
  flex-direction: column;
}
.cv-document__summary {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--ui-text-toned, #4b5563);
  margin: 0;
}
.cv-document__education {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.cv-document__edu-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}
.cv-document__edu-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.75rem;
}
.cv-document__edu-degree {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--ui-text-highlighted, #111827);
}
.cv-document__edu-period {
  font-size: 0.8125rem;
  color: var(--ui-text-muted, #6b7280);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.cv-document__edu-inst {
  font-size: 0.8125rem;
  color: var(--ui-text-toned, #4b5563);
}
</style>
