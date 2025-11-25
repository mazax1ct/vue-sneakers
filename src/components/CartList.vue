<script setup>
import CartItem from './CartItem.vue'


</script>

<template>
  <div class="cart-list flex flex-col gap-5 mb-5">
    <CartItem
      cardTitle="Мужские Кроссовки Nike Blazer Mid Suede"
      imageUrl="/sneakers/sneakers-1.jpg"
      :price="19500"
    />

    <CartItem
      cardTitle="Мужские Кроссовки Nike Blazer Mid Suede"
      imageUrl="/sneakers/sneakers-1.jpg"
      :price="19500"
    />

    <CartItem
      cardTitle="Мужские Кроссовки Nike Blazer Mid Suede"
      imageUrl="/sneakers/sneakers-1.jpg"
      :price="19500"
    />

    <CartItem
      cardTitle="Мужские Кроссовки Nike Blazer Mid Suede"
      imageUrl="/sneakers/sneakers-1.jpg"
      :price="19500"
    />
  </div>
</template>
