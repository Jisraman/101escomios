<template>
  <div class="app-container">
    <el-main>
      <PanelVistas/>
      <PanelPreguntas/>
      <PanelEfectos/>
    </el-main>
  </div>
</template>

<script>
import PanelPreguntas from "@/components/control/PanelPreguntas.vue";
import PanelVistas from "@/components/control/PanelVistas.vue";
import PanelEfectos from "@/components/control/PanelEfectos.vue";

export default {
  components: {
    PanelPreguntas,
    PanelVistas,
    PanelEfectos
  }
};
</script>

<style scoped>
.app-container {
  height: 100vh;
}
</style>
