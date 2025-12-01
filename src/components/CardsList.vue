<script setup>
import ProductCard from './ProductCard.vue'

defineProps({
  items: Array,
})

const emit = defineEmits(['addToFavorite, onClickPlusButton'])
</script>

<template>
  <div class="grid grid-cols-4 gap-5">
    <ProductCard
      v-for="item in items"
      :key="item.id"
      :id="item.id"
      :title="item.name"
      :imageUrl="item.imageUrl"
      :price="item.price"
      :isAdded="item.isAdded"
      :isFavorite="item.isFavorite"
      :onClickFavorite="() => emit('addToFavorite', item)"
      :onClickAdd="() => emit('onClickPlusButton', item)"
    />
  </div>
</template>
