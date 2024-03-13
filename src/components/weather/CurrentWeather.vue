<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

defineProps<{
  location?: string;
  temp?: number;
  condition?: string;
  maxTemp?: number;
  minTemp?: number;
}>();

const scrollY = ref<number>(0);

const handleScroll = () => {
  scrollY.value = window.scrollY;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template lang="pug">
.mx-auto.bg-white.mr-10(class="w-[400px] py-[59px] px-[53px] rounded-[26px]")
  span.block.font-extrabold.text-xl(class="mb-[22px] text-black/50") {{ condition }}
  span.block.font-bold(class="mb-[22px] text-[75px]") {{ temp }}°C
  .flex.items-center.mb-8.text-xl.font-bold.text-primary
    span.mr-5 H:{{ maxTemp }}°
    span L:{{ minTemp }}°
  h2.font-bold(class="text-[25px]") {{ location }}
</template>
