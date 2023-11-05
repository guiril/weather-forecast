<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

defineProps<{
  location?: string;
  temp?: number;
  condition?: string;
  maxTemp?: number;
  minTemp?: number;
}>();

const scrollY = ref<number>(0);

const containerTop = computed(() => {
  const maxTop = 72;
  const minTop = 0;
  const top = maxTop - scrollY.value;

  return maxTop - scrollY.value <= minTop ? minTop : top;
});

const getOpacity = (
  defaultOpacity: number,
  scrollValue: number,
  scale: number
) => {
  let opacity = defaultOpacity;

  if (scrollY.value > scrollValue) {
    if (opacity === 0) {
      opacity = scrollY.value / scale > 1 ? 1 : scrollY.value / scale;
    } else if (opacity === 1) {
      opacity = 1 - scrollY.value / scale < 0 ? 0 : 1 - scrollY.value / scale;
    }
  }

  return {
    opacity: opacity
  };
};

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
.fixed.z-20.w-full.text-center(class="max-w-[640px] left-2/4 translate-x-[-50%]" :style="{ top: containerTop + 'px' }")
  .w-full.flex.flex-col.items-center.mb-8.text-slate-50
    .w-full.pt-8.pb-2.flex.flex-col.items-center.bg-primary
      h2.mb-2.text-3xl.font-semibold.tracking-wider {{ location }}
      .flex.justify-center.items-center(v-if="scrollY > 135" :style="getOpacity(0, 135, 230)")
        span.mr-3.font-medium.tracking-wide {{ temp }}°C
        span.font-medium.tracking-wide {{ condition }}
    span.mb-2.text-5xl.font-bold(:style="getOpacity(1, 95, 130)") {{ temp }}°C
    span.font-medium.tracking-wide(class="mb-0.5" :style="getOpacity(1, 64, 100)") {{ condition }}
    .flex(:style="getOpacity(1, 30, 70)")
      span.mr-3.font-medium.tracking-wide H:{{ maxTemp }}°
      span.font-medium.tracking-wide L:{{ minTemp }}°
</template>
