<script setup>
import { inject } from 'vue'

//получаем прокинутую функцию closeDrawer из App.vue
const { closeDrawer } = inject('cart')

defineProps({
  imageUrl: String,
  title: String,
  text: String,
})
</script>

<template>
  <div class="cart-empty flex flex-col text-center items-center mt-auto mb-auto">
    <img class="w-32 mb-5" :src="imageUrl" alt="Корзина" />

    <h2 class="mb-5 font-bold text-2xl">{{ title }}</h2>

    <p class="mb-5 text-slate-500">{{ text }}</p>

    <button
      @click="closeDrawer"
      class="bg-lime-500 flex text-white justify-center items-center gap-4 rounded-xl p-3 pr-6 pl-6 cursor-pointer"
      type="button"
    >
      <img class="rotate-180" src="/arrow-next.svg" alt="" />
      Вернуться назад
    </button>
  </div>
</template>
