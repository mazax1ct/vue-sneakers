<script setup>
import { onMounted, ref, reactive, watch, provide, computed } from 'vue'
import axios from 'axios'

import PageHeader from './components/PageHeader.vue'
import CardsList from './components/CardsList.vue'
import Drawer from './components/Drawer.vue'

//константы для хранения реактивных данных о карточках товаров и значениях фильтров
const items = ref([])

//по умолчанию сортировка по имени
const filters = reactive({
  sortBy: 'name',
  searchQuery: '',
})

//флаг о том показан ли блок корзины
const drawerOpen = ref(false)

//реактивная переменная для хранения товаров в корзине
const cartItems = ref([])

//вычисляемая реактивная переменная для хранения стоимости корзины (принимает функцию которая и вычисляет стоимость корзины)
const cartPrice = computed(() => cartItems.value.reduce((acc, item) => acc + item.price, 0))

//вычисляемая реактивная переменная для хранения налога для корзины
const vatPrice = computed(() => (cartPrice.value * 0.05).toFixed(2))

//функция получения данных с бека
const fetchItems = async () => {
  //параметр сортировки
  const params = {
    sortBy: filters.sortBy,
  }

  //если есть значение в строке поиска, то к параметрам добавляется поле 'name' для выборки в соответсвии со значением в строке поиска
  if (filters.searchQuery) {
    params.name = `*${filters.searchQuery}*`
  }

  try {
    //запрос через аxios с доп. параметрами
    const { data } = await axios.get('https://e2d1386770118d32.mokky.dev/items', {
      params,
    })

    //дополняем объект элементов полями
    items.value = data.map((obj) => ({
      ...obj,
      isAdded: false,
      favoriteId: null,
      isFavorite: false,
    }))
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
}

//запрос данных об избранном
const fetchFavorites = async () => {
  try {
    //запрос через аxios, data переименовывается в favorites
    const { data: favorites } = await axios.get('https://e2d1386770118d32.mokky.dev/favorites')

    //разбираем ранее полученные items и сопоставляем со списком избранного
    items.value = items.value.map((item) => {
      const favorite = favorites.find((favorite) => favorite.parentId === item.id)

      //если элемента нет в избранном возвращаем элемент
      if (!favorite) {
        return item
      }

      //в противном случае возвращаем элемент с обновленным полем isFavorite и дописываем id избранного элемента
      return {
        ...item,
        isFavorite: true,
        favoriteId: favorite.id,
      }
    })
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
}

//функция добавления/удаления из избранного
const addToFavorite = async (item) => {
  if (!item.isFavorite) {
    try {
      const obj = {
        parentId: item.id,
      }

      item.isFavorite = true

      const { data } = await axios.post('https://e2d1386770118d32.mokky.dev/favorites', obj)

      item.favoriteId = data.id
    } catch (err) {
      console.log(err)
    }
  } else {
    item.isFavorite = false
    await axios.delete(`https://e2d1386770118d32.mokky.dev/favorites/${item.favoriteId}`)

    item.favoriteId = null
  }
}

//вызов функции получения данных с бека при маунте
onMounted(async () => {
  await fetchItems()
  await fetchFavorites()
})

//отслеживание изменений объекта filters
watch(filters, fetchItems)

//функции изменения фильтров
const onChangeSelect = (event) => {
  filters.sortBy = event.target.value
}

const onChangeSearchInput = (event) => {
  filters.searchQuery = event.target.value
}

//функция закрытия блока корзины
const closeDrawer = () => {
  drawerOpen.value = false
  const html = document.querySelector('body')
  html.classList.remove('is-overflow')
}

//функция открытия блока корзины
const openDrawer = () => {
  drawerOpen.value = true
  const html = document.querySelector('body')
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

//функция добавления/удаления из корзины
const onClickPlusButton = (item) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
}

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
  <Drawer v-if="drawerOpen" :cartPrice="cartPrice" :vatPrice="vatPrice" />

  <div class="bg-white w-4/5 m-auto mt-10 mb-10 rounded-xl shadow-xl">
    <!--прокидываем функцию открытия корзины через emit-->
    <PageHeader :cartPrice="cartPrice" @openDrawer="openDrawer" />

    <div class="p-10">
      <div class="flex items-center justify-between gap-4 mb-8">
        <h1 class="font-black text-3xl">Все кроссовки</h1>

        <div class="flex gap-4">
          <!--начевишваем событие на изменение select-->
          <select
            @change="onChangeSelect"
            class="border border-slate-200 rounded-md pr-4 py-2 pl-4"
          >
            <option value="name">По названию</option>
            <option value="price">По цене (дешевле)</option>
            <option value="-price">По цене (дороже)</option>
          </select>

          <form class="search relative" action="">
            <label>
              <!--начевишваем событие на изменение input-->
              <input
                @input="onChangeSearchInput"
                class="border border-slate-200 rounded-md pr-4 pl-10 py-2 outline-none focus-visible:border-slate-500"
                type="text"
                placeholder="Поиск"
              />
            </label>
            <button
              class="absolute left-0 top-2/4 -translate-y-2/4 cursor-pointer w-10 h-10 flex items-center justify-center"
              type="submit"
              title="Искать"
            >
              <img src="/search.svg" alt="Искать" />
            </button>
          </form>
        </div>
      </div>

      <!--прокидываем данные о товарах через пропсы, функцию добаления/удаления из избранного и функцию добавления в корзину через emit-->
      <CardsList
        :items="items"
        @addToFavorite="addToFavorite"
        @onClickPlusButton="onClickPlusButton"
      />
    </div>
  </div>
</template>

<style scoped></style>
