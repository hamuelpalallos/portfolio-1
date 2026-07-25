<script setup lang="ts">
const { data: page } = await useAsyncData('cv-page', () => queryCollection('cv').path('/cv').first())

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description
})

defineOgImage('Portfolio', {
  title: page.value?.title,
  description: page.value?.description,
  headline: 'CV'
})

function handlePrint() {
  if (import.meta.client) {
    window.print()
  }
}
</script>

<template>
  <UContainer class="py-8 sm:py-12 cv-page">
    <div class="cv-page__toolbar">
      <UPageHeader
        :title="page?.title"
        :description="page?.description"
        class="cv-page__header"
      />
      <UButton
        icon="i-lucide-printer"
        color="neutral"
        variant="solid"
        label="Print"
        class="cv-page__print"
        @click="handlePrint"
      />
    </div>

    <div class="cv-page__sheet cv-sheet">
      <CvDocument :page="page" />
    </div>
  </UContainer>
</template>

<style scoped>
.cv-page__toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.cv-page__header {
  flex: 1 1 320px;
}
.cv-page__print {
  flex-shrink: 0;
  align-self: flex-end;
}
.cv-page__sheet {
  margin-top: 2rem;
  padding: 1.5rem;
}
@media (min-width: 640px) {
  .cv-page__sheet {
    padding: clamp(2rem, 5vw, 3rem);
  }
}
</style>
