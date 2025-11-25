<script setup>
import CartList from './CartList.vue'
</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-70"></div>
  <div class="bg-white w-96 h-full fixed right-0 top-0 z-10 p-10 flex flex-col">
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-2xl">Корзина</h2>

      <button class="cursor-pointer" type="button" title="Закрыть">
        <img src="/close.svg" alt="Закрыть" />
      </button>
    </div>

    <CartList />

    <div class="mt-auto">
      <p class="flex items-end justify-between gap-2 mb-2"><span>Итого:</span> <span class="grow border-b border-slate-300 border-dashed"></span> <b>21 498 руб.</b></p>
      <p class="flex items-end justify-between gap-2 mb-5"><span>Налог 5%:</span> <span class="grow border-b border-slate-300 border-dashed"></span> <b>1074 руб.</b></p>
    </div>

    <a class="bg-lime-500 flex text-white justify-center items-center gap-4 rounded-xl p-2" href="">
      <span>Оформить заказ</span>
      <img src="/arrow-next.svg" alt="">
    </a>
  </div>
</template>
