<template>
  <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
    <!-- Entrada para Equipo A -->
    <div style="display: block; align-items: center; gap: 10px;">
      <div>
        <p style="width: 100%; text-align: center;">Escribe el nombre de los equipos y despues da click en "Mostrar"</p>
      </div>
      <div  style="display: flex; align-items: center; gap: 10px;">
        <el-input 
          v-model="equipoA.nombre" 
          placeholder="Nombre del Equipo 1"
          style="width: 300px;"
        ></el-input>
        <el-input 
          v-model="equipoB.nombre" 
          placeholder="Nombre del Equipo 2"
          style="width: 300px;"
        ></el-input>
      </div>
      
    </div>

    <!-- Botones -->
    <div style="display: flex; gap: 20px;">
      <el-button type="primary" @click="guardarNombres">
        Mostrar Equipos
      </el-button>
      <el-button type="danger" @click="resetStores">
        Reset Juego
      </el-button>
    </div>
  </div>
</template>

<script>
import { useEquiposStore } from "../../stores/store";
import { usePreguntasStore } from "../../stores/store";

export default {
  name: "SetEquipos",
  data() {
    return {
      equipoA: {
        nombre: "", // Nombre del equipo A
      },
      equipoB: {
        nombre: "", // Nombre del equipo B
      },
      broadcastChannel: null, // Canal de comunicación
    };
  },
  mounted() {
    // Crear un canal de comunicación si no existe
    this.broadcastChannel = new BroadcastChannel("question_channel");

  },
  methods: {
    guardarNombres() {
      // Accedemos al store de equipos
      const storeEquipos = useEquiposStore();

      // Actualizamos los nombres de los equipos en el store
      storeEquipos.setNombreEquipo("A", this.equipoA.nombre);
      storeEquipos.setNombreEquipo("B", this.equipoB.nombre);

      // Enviamos los nombres por el canal de comunicación
      this.broadcastChannel.postMessage({
        action: "guardar_nombres",
        equiposNombres: {
          equipoA: this.equipoA.nombre,
          equipoB: this.equipoB.nombre,
        },
        
      });

      console.log("Nombres de equipos guardados y enviados:", this.equipoA.nombre, this.equipoB.nombre);
    },
    resetStores() {
      // Accedemos a los stores
      const storeEquipos = useEquiposStore();
      const storePreguntas = usePreguntasStore();

      // Reiniciar los estados de los stores
      storeEquipos.reiniciarPuntuaciones();
      storePreguntas.reiniciarPregunta();

      // Enviar el mensaje de reinicio por el canal de comunicación
      this.broadcastChannel.postMessage({
        action: "reset",
      });

      // Resetear los inputs locales
      this.equipoA.nombre = "";
      this.equipoB.nombre = "";

      console.log("Stores reseteados y mensaje enviado por el canal");
    },
  },
  beforeDestroy() {
    // Cerramos el canal de comunicación al destruir el componente
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
    }
  },
};
</script>

<style scoped>
/* Opcional: Estilo para centrar y ajustar el diseño */
</style>
