<script setup lang="ts">
defineProps<{
  location?: string;
  temp?: number;
  condition?: string;
  maxTemp?: number;
  minTemp?: number;
}>();
</script>

<template lang="pug">
.flex.flex-col.items-center.mb-8.text-slate-50
  h2.mb-2.text-3xl.font-semibold.tracking-wider {{ location }}
  span.mb-2.text-5xl.font-bold {{ temp }}°C
  span.font-medium.tracking-wide(class="mb-0.5") {{ condition }}
  .flex
    span.mr-3.font-medium.tracking-wide H:{{ maxTemp }}°
    span.font-medium.tracking-wide L:{{ minTemp }}°
</template>
