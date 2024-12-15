<template>
  <div class="vista-controlada">
    <!-- InicioLogo -->
    <div
      class="view"
      :class="{ visible: currentView === 'inicio' }"
    >
      <InicioLogo />
    </div>

    <!-- TableroPreguntas -->
    <div
      class="view"
      :class="{ visible: currentView === 'tablero' }"
    >
      <TableroPreguntas />
    </div>
  </div>
</template>

<script>
import InicioLogo from './InicioLogo.vue';
import TableroPreguntas from './TableroPreguntas.vue';

export default {
  name: 'VistaControlada',
  components: {
    InicioLogo,
    TableroPreguntas
  },
  data() {
    return {
      currentView: 'inicio', // Vista predeterminada
      broadcastChannel: null
    };
  },
  mounted() {
    // Crear el canal de comunicación
    this.broadcastChannel = new BroadcastChannel('appChannel');

    // Escuchar mensajes enviados desde la ventana controladora
    this.broadcastChannel.addEventListener('message', this.handleMessage);

    // También escuchar los mensajes enviados por postMessage (en caso de que se use)
    window.addEventListener('message', this.handleMessage, false);
  },
  beforeDestroy() {
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
    }
    window.removeEventListener('message', this.handleMessage, false);
  },
  methods: {
    handleMessage(event) {
      if (event.origin === window.location.origin || event.source === window) {
        const message = event.data;

        // Cambiar la vista dependiendo de la acción recibida
        if (message.view === 'tablero') {
          this.currentView = 'tablero';
        } else if (message.view === 'inicio') {
          this.currentView = 'inicio';
        }
      }
    }
  }
};
</script>

<style scoped>
.vista-controlada {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0px;
}

.view {
  opacity: 0;
  width: 100% !important;
  position: relative; /* Superpone las vistas */
  transition: opacity 0.5s ease; /* Controla la duración de la transición */
  pointer-events: none; /* Hace que las vistas ocultas no interfieran */
}

.view.visible {
  opacity: 1;
  pointer-events: auto; /* Activa la interacción con la vista visible */
}
</style>
