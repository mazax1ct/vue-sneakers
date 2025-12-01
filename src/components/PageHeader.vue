<script setup>
const emit = defineEmits(['openDrawer'])

defineProps({
  cartPrice: Number
})
</script>

<template>
  <header class="header flex items-center justify-between p-16 border-b border-slate-200">
    <div class="header__logo-block flex items-center justify-center gap-4">
      <a class="header__logo w-10" href="/">
        <img src="/logo.png" alt="Logo" />
      </a>

      <div>
        <p class="header__logo-title text-xl font-bold uppercase">REACT SNEAKERS</p>
        <p class="header__logo-text text-slate-500">Магазин лучших кроссовок</p>
      </div>
    </div>

    <nav class="header__menu">
      <ul class="header__menu-list flex gap-10">
        <li @click="emit('openDrawer')">
          <a
            class="header__menu-link flex items-center gap-2 font-medium text-gray-500 hover:text-black"
            href="#"
          >
            <img src="/cart.svg" alt="Корзина" />
            <span>{{ cartPrice }} руб.</span>
          </a>
        </li>
        <li>
          <a
            class="header__menu-link flex items-center gap-2 font-medium text-gray-500 hover:text-black"
            href="#"
          >
            <img src="/heart.svg" alt="Закладки" />
            <span>Закладки</span>
          </a>
        </li>
        <li>
          <a
            class="header__menu-link flex items-center gap-2 font-medium text-gray-500 hover:text-black"
            href="#"
          >
            <img src="/profile.svg" alt="Профиль" />
            <span>Профиль</span>
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style lang="sass" scoped></style>
