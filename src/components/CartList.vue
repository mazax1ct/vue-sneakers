<script setup>
import { inject } from 'vue'

import CartItem from './CartItem.vue'

const { cartItems, removeFromCart } = inject('cart')
</script>

<template>
  <div class="cart-list flex flex-col gap-5 mb-5">
    <CartItem
      v-for="item in cartItems"
      :key="item.id"
      :title="item.name"
      :price="item.price"
      :imageUrl="item.imageUrl"
      @onClickRemove="removeFromCart(item)"
    />
  </div>
</template>
