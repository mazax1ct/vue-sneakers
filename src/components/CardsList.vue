<script setup>
import ProductCard from './ProductCard.vue'

defineProps({
  items: Array
});
</script>

<template>
  <div class="grid grid-cols-4 gap-5">
    <ProductCard
      v-for="item in items"
      :key="item.id"
      :title="item.name"
      :imageUrl="item.imageUrl"
      :price="item.price"
      :isAdded="false"
      :isFavorite="false"
    />
  </div>
</template>
