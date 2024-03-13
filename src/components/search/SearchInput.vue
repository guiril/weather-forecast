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
input.py-5.text-center(class="w-[460px] text-[22px] bg-[#E8E8E8] rounded-[20px]" type="text" placeholder="Search City" v-model="searchInput" @keyup.enter="onSearchClicked" autofocus)
</template>
