<template>
  <div class="app-container">
    <el-main class="main-container">
      <PanelVistas />
      <PanelPreguntas />
      <PanelEfectos />
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
    PanelEfectos,
  },
};
</script>

<style scoped>
/* Contenedor principal que ocupa toda la altura */
.app-container {
  height: 100vh;
}

/* Configuración del Main con flexbox */
.main-container {
  display: flex;
  flex-direction: column; /* Alinear elementos en columna */
  gap: 20px; /* Espaciado vertical entre paneles */
  padding: 20px; /* Separación interna opcional */
  height: 100%; /* Ocupa el contenedor */
  box-sizing: border-box; /* Incluye padding en el cálculo del tamaño */
}

/* Opcional: estilos globales para cada panel */
.main-container > * {
  background-color: #f5f5f5; /* Fondo claro para cada panel */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra sutil */
  padding: 10px; /* Separación interna en los paneles */
}
</style>
