<script setup lang="ts">
import { getDateFromFullTime, getHoursFromFullTime } from '../../utils';

const props = defineProps<{
  hoursWeather?: any[];
  currentDate?: number;
  currentHours?: number;
}>();

const formatHours = (time: string) => {
  const weatherDate = getDateFromFullTime(time);
  const weatherHours = getHoursFromFullTime(time);

  return weatherDate === props.currentDate &&
    weatherHours === props.currentHours
    ? 'Now'
    : weatherHours;
};
</script>

<template lang="pug">
ul.flex.p-2.mb-8.rounded-md.overflow-x-auto.scrollbar-hide(class="bg-white/60")
  li.flex.flex-col.items-center.mr-4.text-zinc-800(class="last:mr-0" v-for="hour in hoursWeather" :key="hour.time_epoch")
    template(v-if="hour.condition")
      span.text-lg.font-medium {{ formatHours(hour.time) }}
      img.w-8.h-8.my-2(:src="hour.condition.icon")
      span.text-xl.font-medium {{ hour.temp_c }}°
    template(v-else)
      span.text-lg.font-medium {{ hour.time }}
      img.w-8.h-8.my-2(:src="hour.title === 'Sunrise' ? '../../assets/sunrise.png' : '../../assets/sunset.png'")
      span.text-xl.font-medium {{ hour.title }}
</template>
