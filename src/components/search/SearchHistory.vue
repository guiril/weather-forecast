<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import LoadingIcon from '../LoadingIcon.vue';

const HISTORY_LIST_KEY = 'searchHistoryList';

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
        await fetch(`https://weather-auth.vercel.app/current/${location}`)
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
.container.flex.flex-col.items-center(class="pb-[98px]")
  h2.mb-4.text-2xl.font-semibold.text-center.text-white Search History
  LoadingIcon(v-if="isLoading" class="mt-[80px]")
  template(v-else)
    ul.w-full.mb-4(v-if="searchHistoryList.length > 0")
      li.p-2.flex.justify-between.mb-2.rounded-md(class="bg-white/60 last:mb-0" v-for="item in currentWeather" @click="goWeahterPage(item.location.name)")
        .flex.flex-col.jutify-between
          .mb-4
            h3.text-2xl.font-semibold.tracking-wider {{ item.location.name }}
            span.mr-2.font-medium.tracking-wide {{ item.location.localtime.substring(item.location.localtime.length - 5) }}
          .flex.items-center
            img.w-8.h-8.mr-2(:src="item.current.condition.icon", :alt="item.current.condition.text")
            span.mr-2.font-medium.tracking-wide {{ item.current.condition.text }}
        div
          span.mr-2.text-3xl.font-bold {{ item.current.temp_c }}°C
    button.w-40.py-3.py-1.bg-info.rounded(type="button" class="hover:bg-yellow-300" v-if="searchHistoryList.length !== 0" @click="clearSearchHistory") Clear All History
</template>
