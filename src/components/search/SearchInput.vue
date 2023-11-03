<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const searchInput = ref<string>('');
const router = useRouter();

const onSearchClicked = () => {
  if (!searchInput.value) return;
  router.push(`/weather/${searchInput.value}`);
};
</script>

<template lang="pug">
.w-full.flex.justify-center.items-center.mb-16
  input.px-2.py-1.mr-2.rounded(type="text" placeholder="Find Weather by City" v-model="searchInput" @keyup.enter="onSearchClicked" autofocus)
  button.px-2.py-1.bg-info.rounded(type="submit" @click="onSearchClicked") Search
</template>
