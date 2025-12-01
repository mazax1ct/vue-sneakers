<script setup>
const emit = defineEmits('onClickRemove')

defineProps({
  id: Number,
  imageUrl: String,
  title: String,
  price: Number,
})
</script>

<template>
  <div class="cart-item flex items-center gap-4 border border-slate-300 p-4 rounded-xl">
    <div class="cart-item__image w-16 min-w-16 h-16">
      <img :src="imageUrl" :alt="title" />
    </div>

    <div class="cart-item__info flex gap-2 items-end justify-between grow">
      <div class="grow">
        <p class="cart-item__title text-xs">{{ title }}</p>
        <p class="cart-item__price font-bold">{{ price }} руб.</p>
      </div>

      <button @click="emit('onClickRemove')"
        class="cart-item__delete min-w-8 w-8 h-8 cursor-pointer"
        type="button"
        title="Удалить"
      >
        <img src="/close.svg" alt="Удалить" />
      </button>
    </div>
  </div>
</template>
