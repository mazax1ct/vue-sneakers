<script setup>
import { inject } from 'vue'

//получаем прокинутую функцию closeDrawer из App.vue
const { closeDrawer } = inject('cart')
</script>

<template>
  <div class="flex items-center justify-between mb-5">
    <h2 class="text-2xl">Корзина</h2>

    <!--закрытие корзины по клику-->
    <button @click="closeDrawer" class="cursor-pointer" type="button" title="Закрыть">
      <img src="/close.svg" alt="Закрыть" />
    </button>
  </div>
</template>
