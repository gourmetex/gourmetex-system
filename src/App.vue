<template>
  <div id="app">
    <router-view path="$router.key" />
  </div>
</template>

<script>
import './style/global.css';
import 'animate.css';
import '@lottiefiles/lottie-player';

export default {
  name: 'App'
}
</script>
