<script setup>
import axios from 'axios'
import { inject, reactive, watch, ref, onMounted } from 'vue'

import CardsList from '@/components/CardsList.vue'

const { cartItems, addToCart, removeFromCart } = inject('cart')

//константы для хранения реактивных данных о карточках товаров и значениях фильтров
const items = ref([])

//по умолчанию сортировка по имени
const filters = reactive({
  sortBy: 'name',
  searchQuery: '',
})

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

//функции изменения фильтров
const onChangeSelect = (event) => {
  filters.sortBy = event.target.value
}

const onChangeSearchInput = (event) => {
  filters.searchQuery = event.target.value
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

//функция добавления/удаления из корзины
const onClickPlusButton = (item) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
}

//отслеживание изменений объекта filters
watch(filters, fetchItems)

//вотчер за очисткой корзины
watch(cartItems, () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: false,
  }))
})

//вызов функции получения данных с бека при маунте
onMounted(async () => {
  //проверка наличия записи в localStorage и если запись есть то парсится строка значения этой записи и записывается в value переменной списка товаров в корзине, в противном случае там будет пустой массив
  const localCart = localStorage.getItem('cart')
  cartItems.value = localCart ? JSON.parse(localCart) : []

  await fetchItems()
  await fetchFavorites()

  //ТОЛЬКО ПОСЛЕ получения данных о товарах с бека, сравниваем id товаров в коризне с id товаров с бека и устанавливаем флаг isAdded
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cartItems.value.some((cartItem) => cartItem.id === item.id),
  }))
})
</script>

<template>
  <div class="flex items-center justify-between gap-4 mb-8">
    <h1 class="font-black text-3xl">Все кроссовки</h1>

    <div class="flex gap-4">
      <!--навешиваем событие на изменение select-->
      <select @change="onChangeSelect" class="border border-slate-200 rounded-md pr-4 py-2 pl-4">
        <option value="name">По названию</option>
        <option value="price">По цене (дешевле)</option>
        <option value="-price">По цене (дороже)</option>
      </select>

      <form class="search relative" action="">
        <label>
          <!--навешиваем событие на изменение input-->
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
  <CardsList :items="items" @addToFavorite="addToFavorite" @onClickPlusButton="onClickPlusButton" />
</template>
