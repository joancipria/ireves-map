<template>
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div> -->
  <router-view />
</template>

<style lang="scss">
html,
body {
  height: 100%;
  overflow: hidden !important;
}
#app {
  height: 100%;
  overflow: hidden;
}
.select:not(.is-multiple):not(.is-loading)::after {
  border-color: #0a0a0a !important;
}
</style>
