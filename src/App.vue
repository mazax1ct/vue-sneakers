<script setup>
import {ref, watch, provide, computed } from 'vue'
import axios from 'axios'

import PageHeader from './components/PageHeader.vue'
import Drawer from './components/Drawer.vue'

//флаг о том показан ли блок корзины
const drawerOpen = ref(false)

//реактивная переменная для хранения товаров в корзине
const cartItems = ref([])

//вычисляемая реактивная переменная для хранения стоимости корзины (принимает функцию которая и вычисляет стоимость корзины)
const cartPrice = computed(() => cartItems.value.reduce((acc, item) => acc + item.price, 0))

//вычисляемая реактивная переменная для хранения налога для корзины
const vatPrice = computed(() => parseFloat((cartPrice.value * 0.05).toFixed(2)))

//переменная флаг о процессе создания заказа
const isCreatingOrder = ref(false)

//функция закрытия блока корзины
const closeDrawer = () => {
  drawerOpen.value = false
  const html = document.querySelector('html')
  html.classList.remove('is-overflow')
}

//функция открытия блока корзины
const openDrawer = () => {
  drawerOpen.value = true
  const html = document.querySelector('html')
  html.classList.add('is-overflow')
}

//функция добавления товара в корзину
const addToCart = (item) => {
  cartItems.value.push(item)
  item.isAdded = true
}

//функция удаления товара в корзину
const removeFromCart = (item) => {
  cartItems.value.splice(cartItems.value.indexOf(item), 1)
  item.isAdded = false
}

//функция создания заказа
const createOrder = async () => {
  try {
    isCreatingOrder.value = true

    const { data } = await axios.post(`https://e2d1386770118d32.mokky.dev/orders/`, {
      items: cartItems.value,
      price: cartPrice.value,
    })

    cartItems.value = []

    return data
  } catch (err) {
    console.log(err)
  } finally {
    isCreatingOrder.value = false
  }
}

//глубокое слежение за корзиной и запись/удаление в localStorage
watch(
  cartItems,
  () => {
    localStorage.setItem('cart', JSON.stringify(cartItems.value))
  },
  {
    deep: true,
  },
)

//прокидываение функции закрытия корзины из родительского компонента в дочерний через provide/inject
provide('cart', {
  cartItems,
  closeDrawer,
  addToCart,
  removeFromCart,
})
</script>

<template>
  <!--при установленном флаге drawerOpen блок корзины будет показан-->
  <Drawer
    v-if="drawerOpen"
    :cartPrice="cartPrice"
    :vatPrice="vatPrice"
    @createOrder="createOrder"
    :isCreatingOrder="isCreatingOrder"
  />

  <div class="bg-white w-4/5 m-auto mt-10 mb-10 rounded-xl shadow-xl">
    <!--прокидываем функцию открытия корзины через emit-->
    <PageHeader :cartPrice="cartPrice" @openDrawer="openDrawer" />

    <div class="p-10">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
