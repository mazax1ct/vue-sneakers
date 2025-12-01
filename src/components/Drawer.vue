<script setup>
import CartList from './CartList.vue'
import DrawerHead from './DrawerHead.vue'
import { inject } from 'vue'

//получаем прокинутую функцию closeDrawer из App.vue
const { closeDrawer } = inject('cart')

defineProps({
  cartPrice: Number,
  vatPrice: Number,
})
</script>

<template>
  <div @click="closeDrawer" class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-70"></div>

  <div class="bg-white w-96 h-full fixed right-0 top-0 z-10 p-10 flex flex-col overflow-y-auto">
    <DrawerHead />

    <CartList />

    <div class="mt-auto">
      <p class="flex items-end justify-between gap-2 mb-2">
        <span>Итого:</span> <span class="grow border-b border-slate-300 border-dashed"></span>
        <b>{{ cartPrice }} руб.</b>
      </p>
      <p class="flex items-end justify-between gap-2 mb-5">
        <span>Налог 5%:</span> <span class="grow border-b border-slate-300 border-dashed"></span>
        <b>{{ vatPrice }} руб.</b>
      </p>
    </div>

    <button
      class="bg-lime-500 flex text-white justify-center items-center gap-4 rounded-xl p-2 cursor-pointer disabled:bg-slate-300 disabled:cursor-default"
      type="button"
      disabled
    >
      <span>Оформить заказ</span>
      <img src="/arrow-next.svg" alt="" />
    </button>
  </div>
</template>
