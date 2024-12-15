<template>
  <div class="app-container">
    <el-main>

      <!-- Renderiza la vista seleccionada -->
      <el-row :gutter="10">
        <el-col :span="8" style="display: grid;">
          <!-- Botón de "Inicio" con tipo dinámico -->
          <el-button 
            @click="openControlledWindow" 
            type="primary">
            Presentacion
          </el-button>
        </el-col>
        <el-col :span="8" style="display: grid;">
          <!-- Botón de "Inicio" con tipo dinámico -->
          <el-button 
            @click="changeView('inicio')" 
            :type="activeButton === 'inicio' ? 'success' : 'info'">
            Inicio
          </el-button>
        </el-col>
        <el-col :span="8" style="display: grid;">
          <!-- Botón de "Tablero" con tipo dinámico -->
          <el-button 
            @click="changeView('tablero')" 
            :type="activeButton === 'tablero' ? 'success' : 'info'">
            Tablero
          </el-button>
        </el-col>
      </el-row>

      <!-- Panel de preguntas -->
      <PanelPreguntas />
    </el-main>
  </div>
</template>

<script>
import PanelPreguntas from "@/components/control/PanelPreguntas.vue";

export default {
  components: {
    PanelPreguntas
  },
  data() {
    return {
      controlledWindow: null, // Referencia a la ventana controlada
      activeButton: 'inicio', // Controla qué botón está activo
      broadcastChannel: null, // Canal de comunicación
    };
  },
  mounted() {
    // Crear el canal de comunicación con nombre 'appChannel'
    this.broadcastChannel = new BroadcastChannel('appChannel');

    // Escuchar mensajes del canal
    //this.broadcastChannel.addEventListener('message', this.handleBroadcastMessage);
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
    changeView(viewSelected) {
      // Cambia la vista activa y actualiza el estado del botón
      this.activeButton = viewSelected;

      // Enviar mensaje al canal para cambiar la vista en las vistas afectadas
      this.broadcastChannel.postMessage({ view: viewSelected });
      
      // Si la ventana controlada está abierta, enviarle un mensaje también
      if (this.controlledWindow) {
        this.controlledWindow.postMessage({ view: viewSelected }, "*");
      }
    },
    handleBroadcastMessage(/*event*/) {
      // Manejar mensajes recibidos del canal (cambio de vista)
      /*const { view } = event.data;
      if (view && this.views[view]) {
        this.currentView = this.views[view];
      }*/
    },
  },
};
</script>

<style scoped>
.app-container {
  height: 100vh;
}
</style>
