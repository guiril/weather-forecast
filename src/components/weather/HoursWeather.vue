<script setup lang="ts">
defineProps<{
  dayWeather?: any[];
}>();

const formatHours = (timestamp: number) => {
  const currentDate = new Date().getDate();
  const currentHours = new Date().getHours();
  const timestampDate = new Date(timestamp * 1000).getDate();
  const timestampHours = new Date(timestamp * 1000).getHours();

  return timestampDate === currentDate && timestampHours === currentHours
    ? 'Now'
    : timestampHours;
};
</script>

<template lang="pug">
ul.flex.p-2.mb-8.rounded-md.overflow-x-auto.scrollbar-hide(class="bg-white/60")
  li.flex.flex-col.items-center.mr-4.text-zinc-800(class="last:mr-0" v-for="hour in dayWeather" :key="hour.time_epoch")
    template(v-if="hour.condition")
      span.text-lg.font-medium {{ formatHours(hour.time_epoch) }}
      img.w-8.h-8.my-2(:src="hour.condition.icon")
      span.text-xl.font-medium {{ hour.temp_c }}°
    template(v-else)
      span.text-lg.font-medium {{ hour.time }}
      img.w-8.h-8.my-2(:src="hour.title === 'Sunrise' ? 'src/assets/sunrise.png' : 'src/assets/sunset.png'")
      span.text-xl.font-medium {{ hour.title }}
</template>
