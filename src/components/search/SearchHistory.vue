<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import LoadingIcon from '@/components/LoadingIcon.vue';

const HISTORY_LIST_KEY = 'searchHistoryList';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const router = useRouter();

const isLoading = ref<boolean>(false);
const searchHistoryList = ref<{ location: string }[]>(
  JSON.parse(localStorage.getItem(HISTORY_LIST_KEY) || '[]')
);
const currentWeather = ref<any[]>([]);

const goWeahterPage = (location: string) => {
  router.push(`weather/${location}`);
};

const clearSearchHistory = () => {
  if (searchHistoryList.value.length === 0) return;

  searchHistoryList.value = [];
  currentWeather.value = [];
  localStorage.removeItem(HISTORY_LIST_KEY);
};

const getCurrentWeather = async () => {
  if (searchHistoryList.value.length === 0) return;

  const MAX_REQUESTS = 10;
  isLoading.value = true;

  for (let i = 0; i < searchHistoryList.value.length; i++) {
    if (i >= MAX_REQUESTS) break;
    const location = searchHistoryList.value[i].location;

    try {
      const response = await (
        await fetch(`${API_BASE_URL}/current/${location}`)
      ).json();

      if (response.message) {
        throw new Error(response.message);
      }

      currentWeather.value.push(response);
    } catch (err) {
      console.error(err);
    }
  }
  isLoading.value = false;
};

onMounted(() => {
  getCurrentWeather();
});
</script>

<template lang="pug">
main
  .flex.items-center(class="mb-[85px] sm:flex-col sm:mb-8")
    h2.mr-8.font-bold(class="text-[30px] sm:mr-0") Search History
    button.py-3.px-5.text-primary.font-bold.border.border-primary(type="button" class="rounded-[13px] hover:text-white hover:bg-primary sm:hidden" v-if="searchHistoryList.length !== 0" @click="clearSearchHistory" data-button="clear") Clear All History
  LoadingIcon(v-if="isLoading")
  template(v-else)
    ul.grid.grid-cols-4.gap-x-5.gap-y-4(v-if="searchHistoryList.length > 0" class="xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1")
      li.cursor-pointer(class="py-[45px] pl-[43px] pr-[29px] rounded-[20px] bg-white hover:bg-white/50" v-for="item in currentWeather" @click="goWeahterPage(item.location.name)")
        .flex.justify-between.items-center(class="mb-[23px]")
          .flex.items-center
            img.w-8.h-8.mr-2(:src="item.current.condition.icon", :alt="item.current.condition.text")
            span.text-xl.font-extrabold(class="text-black/50") {{ item.current.condition.text }}
          span.text-xl.font-extrabold.text-primary(class="") {{ item.location.localtime.substring(item.location.localtime.length - 5) }}
        span.inline-block.mb-6.text-6xl.font-bold {{ item.current.temp_c }} °C
        h3.text-2xl.font-semibold.tracking-wider {{ item.location.name }}
    button.hidden.py-3.px-5.mx-auto.mt-8.text-primary.font-bold.border.border-primary(type="button" class="rounded-[13px] hover:text-white hover:bg-primary sm:block" v-if="searchHistoryList.length !== 0" @click="clearSearchHistory") Clear All History
</template>
