<script setup>
defineProps({
  id: Number,
  imageUrl: String,
  title: String,
  price: Number,
  isFavorite: Boolean,
  isAdded: Boolean,
  onClickAdd: Function,
  onClickFavorite: Function,
})
</script>

<template>
  <div
    class="card flex flex-col relative bg-white border border-slate-200 rounded-3xl p-8 transition hover:-translate-y-2 hover:shadow-xl"
  >
    <button
      @click="onClickFavorite"
      class="card__favorite absolute top-8 left-8 cursor-pointer"
      type="button"
      title="Добавить в избранное"
    >
      <img :src="!isFavorite ? '/like-1.svg' : '/like-2.svg'" alt="Like" />
    </button>

    <div class="card__image mb-3">
      <img :src="imageUrl" alt="{{ title }}" />
    </div>

    <p class="card__title mb-5">{{ title }}</p>

    <div class="card__bottom flex justify-between items-end mt-auto">
      <p>
        <span class="card__price-title text-slate-400 block uppercase">Цена:</span>
        <span class="card__price block font-bold text-xl">{{ price }} руб.</span>
      </p>

      <button class="card__add-cart cursor-pointer" type="button" title="В корзину">
        <img @click="onClickAdd" :src="!isAdded ? '/plus.svg' : '/checked.svg'" alt="В корзину" />
      </button>
    </div>
  </div>
</template>

<style></style>
