<template lang="pug">
footer.mt-16
  .w-full(class="h-[3px] bg-[#F0F0F0]")
  .py-14
    ul.flex.justify-between.items-center(class="sm:flex-col sm:items-center")
      li.mb-4
        a(href="https://www.weatherapi.com/" title="Free Weather API" target="_blank")
          img.block.mx-auto(src='//cdn.weatherapi.com/v4/images/weatherapi_logo.png' alt="Weather data by WeatherAPI.com" border="0")
      li.text-center
        small(class="text-neutral-50") This project utilizes UI elements from UI8 website created by Josh Corbett.
</template>
