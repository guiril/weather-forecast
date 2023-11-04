<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import LoadingIcon from './LoadingIcon.vue';
import ErrorMessage from './ErrorMessage.vue';
import CurrentWeather from './weather/CurrentWeather.vue';
import HoursWeather from './weather/HoursWeather.vue';
import DaysWeather from './weather/DaysWeather.vue';

const route = useRoute();

const isLoading = ref<boolean>(false);
const errorMessage = ref<string | undefined>(undefined);
const tenDaysWeather = ref<any[]>([]);
const hoursForecast: any[] = [];

let paramsLocation: string | string[];
let currentLocation: string;
let todayTemp: number;
let todayConditionText: string;
let todayMaxTemp: number;
let todayMinTemp: number;

const padZero = (number: number) => (number < 10 ? `0${number}` : number);

const formatHoursMinutes = (date: string, time: string) => {
  const dateObj = new Date(`${date} ${time}`);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();

  return `${padZero(hours)}:${padZero(minutes)}`;
};

const getTodayWeather = (weather: any) => {
  const currentHours = new Date().getHours();
  const weatherDate = weather.date;
  const sunriseTime = weather.astro.sunrise;
  const sunriseHours = new Date(`${weatherDate} ${sunriseTime}`).getHours();
  const sunsetTime = weather.astro.sunset;
  const sunsetHours = new Date(`${weatherDate} ${sunsetTime}`).getHours();

  weather.hour.forEach((weather: any, index: number) => {
    const weatherHours = new Date(weather.time_epoch * 1000).getHours();

    if (index >= currentHours) {
      hoursForecast.push(weather);
    }

    if (sunriseHours >= currentHours && sunriseHours === weatherHours) {
      hoursForecast.push({
        title: 'Sunrise',
        time: formatHoursMinutes(weatherDate, sunriseTime)
      });
    }

    if (sunsetHours >= currentHours && sunsetHours === weatherHours) {
      hoursForecast.push({
        title: 'Sunset',
        time: formatHoursMinutes(weatherDate, sunsetTime)
      });
    }
  });
};

const getTomorrowWeather = (weather: any) => {
  const currentHours = new Date().getHours();
  const weatherDate = weather.date;
  const sunriseTime = weather.astro.sunrise;
  const sunriseHours = new Date(`${weatherDate} ${sunriseTime}`).getHours();
  const sunsetTime = weather.astro.sunset;
  const sunsetHours = new Date(`${weatherDate} ${sunsetTime}`).getHours();

  weather.hour.forEach((weather: any, index: number) => {
    const weatherHours = new Date(weather.time_epoch * 1000).getHours();

    if (index <= currentHours) {
      hoursForecast.push(weather);

      if (sunriseHours === weatherHours) {
        hoursForecast.push({
          title: 'Sunrise',
          time: formatHoursMinutes(weatherDate, sunriseTime)
        });
      }

      if (sunsetHours === weatherHours) {
        hoursForecast.push({
          title: 'Sunset',
          time: formatHoursMinutes(weatherDate, sunsetTime)
        });
      }
    }
  });
};

const getHoursWeather = (forecastday: any[]) => {
  getTodayWeather(forecastday[0]);
  getTomorrowWeather(forecastday[1]);
};

const getCurrentWeather = (
  location: string,
  temp: number,
  condition: string,
  minTemp: number,
  maxTemp: number
) => {
  currentLocation = location;
  todayTemp = temp;
  todayConditionText = condition;
  todayMinTemp = minTemp;
  todayMaxTemp = maxTemp;
};

const getWeather = async () => {
  try {
    isLoading.value = true;

    const response = await (
      await fetch(`https://weather-auth.vercel.app/weather/${paramsLocation}`)
    ).json();

    if (response.message) {
      errorMessage.value = response.message;
      isLoading.value = false;
      throw new Error(errorMessage.value);
    }

    errorMessage.value = undefined;
    console.log('Success:', response);

    getCurrentWeather(
      response.location.name,
      response.current.temp_c,
      response.current.condition.text,
      response.forecast.forecastday[0].day.mintemp_c,
      response.forecast.forecastday[0].day.maxtemp_c
    );

    getHoursWeather(response.forecast.forecastday);
    tenDaysWeather.value = [...response.forecast.forecastday];
    isLoading.value = false;
  } catch (err) {
    console.error(err);
  }
};

const getLocation = () => {
  paramsLocation = route.params.location;
};

onMounted(() => {
  getLocation();
  getWeather();
});
</script>

<template lang="pug">
.container.flex.items-center.mb-8
  router-link.inline-block.p-2(to="/")
    img.w-6.h-6(src="../assets/left-arrow.png")
LoadingIcon(v-if="isLoading")
div.container.mb-10(v-else class="pb-[98px]")
  ErrorMessage(v-if="errorMessage" :message="errorMessage")
  template(v-else)
    CurrentWeather(:location="currentLocation" :temp="todayTemp" :condition="todayConditionText" :maxTemp="todayMaxTemp" :minTemp="todayMinTemp")
    HoursWeather(:dayWeather="hoursForecast")
    DaysWeather(:tenDaysWeather="tenDaysWeather")
</template>
