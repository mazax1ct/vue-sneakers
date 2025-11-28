<script setup>
import { onMounted, ref, reactive, watch, provide } from 'vue'
import axios from 'axios'

import PageHeader from './components/PageHeader.vue'
import CardsList from './components/CardsList.vue'

//import Drawer from './components/Drawer.vue'

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

const addToFavorite = async (item) => {
  if (!item.isFavorite) {
    try {
      const obj = {
        parentId: item.id,
      }

      const { data } = await axios.post('https://e2d1386770118d32.mokky.dev/favorites', obj)

      item.isFavorite = true
      item.favoriteId = data.id
    } catch (err) {
      console.log(err)
    }
  } else {
    await axios.delete(`https://e2d1386770118d32.mokky.dev/favorites/${item.favoriteId}`)
    item.isFavorite = false
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
</script>

<template>
  <!--<Drawer />-->

  <div class="bg-white w-4/5 m-auto mt-10 mb-10 rounded-xl shadow-xl">
    <PageHeader />

    <div class="p-10">
      <div class="flex items-center justify-between gap-4 mb-8">
        <h1 class="font-black text-3xl">Все кроссовки</h1>

        <div class="flex gap-4">
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

      <CardsList :items="items" @addToFavorite="addToFavorite" />
    </div>
  </div>
</template>

<style scoped></style>
