<script setup lang="ts">
const { data: page } = await useAsyncData('cv-page', () => queryCollection('pages').path('/cv').first())

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description
})

const experience = [
  {
    position: 'Senior Software Engineer',
    company: 'Tripket PH',
    period: '2022 - Present',
    description: 'Leading development of dashboard systems, mobile applications, and backend infrastructure. Built scalable solutions using Vue.js, Nuxt.js, Flutter, and Laravel.'
  },
  {
    position: 'Software Developer',
    company: 'Asbir Tech',
    period: '2025 - Present',
    description: 'Developing enterprise applications and backend systems with focus on performance, scalability, and maintainability.'
  }
]

const education = [
  {
    degree: 'Bachelor of Science in Computer Science',
    institution: 'Silliman University',
    period: '2018 - 2022',
    description: 'Focused on software engineering, algorithms, and web development technologies.'
  }
]

const skills = {
  'Frontend Development': ['Vue.js', 'Nuxt.js', 'TypeScript', 'Tailwind CSS', 'HTML5', 'CSS3'],
  'Backend Development': ['Laravel', 'PHP', 'Node.js', 'MySQL', 'MongoDB', 'REST APIs'],
  'Mobile Development': ['Flutter', 'Dart', 'Firebase', 'React Native'],
  'Tools & Platforms': ['Git', 'Docker', 'CI/CD', 'Azure', 'VS Code', 'Linux'],
  'Soft Skills': ['Problem Solving', 'Team Collaboration', 'Technical Leadership', 'Communication']
}
</script>

<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      :title="page?.title"
      :description="page?.description"
      :links="page?.links"
    />

    <div class="mt-8 space-y-12">
      <UPageSection
        title="Professional Experience"
        description="My career journey and key roles in software development."
      >
        <div class="space-y-6">
          <div
            v-for="(item, index) in experience"
            :key="index"
            class="relative pl-8 border-l-2 border-muted"
          >
            <div class="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary" />
            <h3 class="text-lg font-semibold">
              {{ item.position }}
            </h3>
            <p class="text-sm text-muted mb-2">
              {{ item.company }} • {{ item.period }}
            </p>
            <p class="text-sm">
              {{ item.description }}
            </p>
          </div>
        </div>
      </UPageSection>

      <UPageSection
        title="Education"
        description="Academic background and formal training."
      >
        <div class="space-y-6">
          <div
            v-for="(item, index) in education"
            :key="index"
            class="relative pl-8 border-l-2 border-muted"
          >
            <div class="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary" />
            <h3 class="text-lg font-semibold">
              {{ item.degree }}
            </h3>
            <p class="text-sm text-muted mb-2">
              {{ item.institution }} • {{ item.period }}
            </p>
            <p class="text-sm">
              {{ item.description }}
            </p>
          </div>
        </div>
      </UPageSection>

      <UPageSection
        title="Technical Skills"
        description="Technologies and tools I work with regularly."
      >
        <div class="grid sm:grid-cols-2 gap-6">
          <div
            v-for="(skillList, category) in skills"
            :key="category"
            class="space-y-2"
          >
            <h4 class="font-semibold text-sm">
              {{ category }}
            </h4>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="skill in skillList"
                :key="skill"
                variant="subtle"
                size="sm"
              >
                {{ skill }}
              </UBadge>
            </div>
          </div>
        </div>
      </UPageSection>

      <UPageSection
        title="Languages"
        description="Languages I speak and write fluently."
      >
        <div class="flex flex-wrap gap-2">
          <UBadge
            variant="subtle"
            size="md"
          >
            English (Native)
          </UBadge>
          <UBadge
            variant="subtle"
            size="md"
          >
            Filipino (Native)
          </UBadge>
          <UBadge
            variant="subtle"
            size="md"
          >
            Cebuano (Native)
          </UBadge>
        </div>
      </UPageSection>
    </div>
  </UContainer>
</template>
