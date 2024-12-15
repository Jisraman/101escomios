<template>
  <div id="app">
    <div class="mainScreen">
      <ControladorVistas/>

    </div>
  </div>
</template>

<script>
import ControladorVistas from './views/control/ControladorVistas.vue'

export default {
  name: 'App',
  components: {
    ControladorVistas
  }
}
</script>


