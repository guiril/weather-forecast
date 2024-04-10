<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { useForecastsStore } from '@/stores/weather';
import { useLocationStore } from '@/stores/location';
import { getCurrentWeatherAPI, getForecasetAPI } from '@/utils/axios';

const forecastStore = useForecastsStore();
const locationStore = useLocationStore();

const router = useRouter();

const route = useRoute();
const path = route.path;

let isLoading: boolean;

interface Weahter {
  icon: string | null;
  condition: string | null;
  time: string | null;
  temp: number | null;
  maxTemp: number | null;
  minTemp: number | null;
  location: string | null;
}

const weather = ref<Weahter>({
  icon: null,
  condition: null,
  time: null,
  temp: null,
  maxTemp: null,
  minTemp: null,
  location: null
});

const resetWeather = () => {
  weather.value = {
    icon: null,
    condition: null,
    time: null,
    temp: null,
    maxTemp: null,
    minTemp: null,
    location: null
  };
};

const getWeather = async (location: string | null) => {
  if (!location) return;

  try {
    const currentData = await getCurrentWeatherAPI(location);
    const forecastData = await getForecasetAPI(location);

    weather.value = {
      icon: currentData.current.condition.icon,
      condition: currentData.current.condition.text,
      time: currentData.location.localtime.split(' ')[1],
      temp: currentData.current.temp_c,
      maxTemp: forecastData.forecast.forecastday[0].day.maxtemp_c,
      minTemp: forecastData.forecast.forecastday[0].day.mintemp_c,
      location: currentData.location.name
    };

    isLoading = false;
  } catch (err) {
    console.error(err);
  }
};

const goWeahterPage = (location: string | null) => {
  if (!isHome || !location) return;
  router.push(`weather/${location}`);
};

const isHome = () => path === '/';

onMounted(async () => {
  isLoading = true;

  if (isHome()) {
    await locationStore.getLocalLocation();
    if (!locationStore.localLocation) return;
    getWeather(locationStore.localLocation);
  } else {
    if (!forecastStore.searchingLocation) return;
    getWeather(forecastStore.searchingLocation);
  }
});

onUnmounted(() => {
  locationStore.resetLocalLocation();
  resetWeather();
});
</script>

<template lang="pug">
.flex.flex-col.items-center
  .flex.items-center.mb-4(class="sm:mb-8")
      h2.mr-8.font-bold(class="text-[30px] sm:mr-0") Local Weather
  .bg-white.relative(:class="{'w-full max-w-[960px] text-center cursor-pointer': isHome(), 'mr-10 shrink-0 lg:w-[296px] md:w-full': !isHome() }" class="w-[400px] py-[59px] px-[53px] rounded-[26px] md:mb-10 md:mx-auto md:text-center" @click="goWeahterPage(weather.location)")
    template(v-if="isLoading || !weather.location")
      .w-full.h-full.flex.flex-col.justify-center.items-center
        .loader
    template(v-else)
      .flex.items-center(:class="{'justify-center': isHome(), 'justify-between': !isHome()}")
        .flex.items-center(:class="{'mr-10': isHome()}")
          img.w-8.h-8.mr-2(:src="weather.icon", :alt="weather.condition")
          span.block.font-extrabold.text-xl(class="text-black/50") {{ weather.condition }}
        span.text-xl.font-extrabold.text-primary {{ weather.time }}
      span.block.font-bold(class="mb-[22px] text-[75px]") {{ weather.temp }}°C
      .flex.items-center.mb-8.text-xl.font-bold.text-primary(:class="{'justify-center': isHome()}" class="md:justify-center")
        span.mr-5 H:{{ weather.maxTemp }}°
        span L:{{ weather.minTemp }}°
      h2.font-bold(class="text-[25px]") {{ weather.location }}
</template>

<style lang="scss" scoped>
/*
  Loading animation from CSS Loaders website.
  https://cssloaders.github.io/
  MIT License
  Copyright (c) 2020 Vineeth.TR
*/
.loader {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  position: relative;
  animation: rotate 1s linear infinite;

  &::before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    inset: 0px;
    border-radius: 50%;
    border: 5px solid #000;
    animation: prixClipFix 2s linear infinite;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes prixClipFix {
  0% {
    clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
  }
  25% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
  }
  50% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
  }
  75% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
  }
  100% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
  }
}
</style>
