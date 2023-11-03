<script setup lang="ts">
defineProps<{
  message?: string;
}>();
</script>

<template lang="pug">
p.py-8.font-bold.text-center.text-red-500.bg-info(class="mt-[180px]") {{ message  }}
</template>
