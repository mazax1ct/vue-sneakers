<script setup>
import ProductCard from './ProductCard.vue'

defineProps({
  items: Array,
})

const emit = defineEmits(['addToFavorite'])
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
      :isAdded="false"
      :isFavorite="item.isFavorite"
      :onClickFavorite="() => emit('addToFavorite', item)"
    />
  </div>
</template>
