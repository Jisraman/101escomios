<template>
  <div class="app-container">
    <!-- Sidebar -->
    <el-container>
      <el-aside width="200px">
        <el-menu @select="changeView">
          <el-menu-item index="0" @click="openControlledWindow">Abrir Ventana Controlada</el-menu-item>
          <el-menu-item index="1">Inicio</el-menu-item>
          <el-menu-item index="2">Tablero</el-menu-item>
        </el-menu>
      </el-aside>

      <!-- Main Content -->
      <el-container>
        <el-main>
          <!-- Renderiza la vista seleccionada -->
          <component :is="currentView" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import PanelPreguntas from "@/components/control/PanelPreguntas.vue";
import PanelInicio from "@/components/control/PanelInicio.vue";

export default {
  data() {
    return {
      controlledWindow: null, // Referencia a la ventana controlada
      currentView: PanelInicio, // Componente actual a renderizar
      views: {
        1: PanelInicio,
        2: PanelPreguntas,
      },
      broadcastChannel: null, // Canal de comunicación
    };
  },
  mounted() {
    // Crear el canal de comunicación con nombre 'appChannel'
    this.broadcastChannel = new BroadcastChannel('appChannel');

    // Escuchar mensajes del canal
    this.broadcastChannel.addEventListener('message', this.handleBroadcastMessage);
  },
  beforeDestroy() {
    // Cerrar el canal de comunicación cuando el componente se destruya
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
    }
  },
  methods: {
    openControlledWindow() {
      // Abrir la ventana controlada
      this.controlledWindow = window.open(
        "SecondaryApp.html",
        "_blank",
        "width=800,height=600"
      );
    },
    changeView(viewIndex) {
      // Actualiza la vista actual basada en el índice
      this.currentView = this.views[viewIndex] || PanelInicio;
      var message = (viewIndex == 1) ? "inicio" : (viewIndex == 2) ? "tablero" : null;

      // Enviar mensaje al canal para cambiar la vista en las vistas afectadas
      this.broadcastChannel.postMessage({ view: message });

      // Si la ventana controlada está abierta, enviarle un mensaje también
      if (this.controlledWindow) {
        this.controlledWindow.postMessage({ view: message }, "*");
      }
    },
    handleBroadcastMessage(event) {
      // Manejar mensajes recibidos del canal (cambio de vista)
      const { view } = event.data;
      if (view && this.views[view]) {
        this.currentView = this.views[view];
      }
    },
  },
};
</script>

<style>
.app-container {
  height: 100vh;
}
</style>
