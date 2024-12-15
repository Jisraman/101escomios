<template>
  <div>
    <div style="display: flex; margin-left: auto; margin-right: auto; width: 70%;">
      <el-select
        v-model="selectedOption"
        placeholder="Selecciona una Pregunta"
        style="margin-right: auto; width: 80%;"
      >
        <el-option v-for="option in options" :key="option" :label="option" :value="option" />
      </el-select>
      <el-button type="primary">Siguiente</el-button>
    </div>

    <!-- Tabla -->
    <el-table :data="tableData" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="name" label="Nombre" />
      <el-table-column prop="value" label="Valor" width="120" />
      <!-- Columna personalizada para acciones -->
      <el-table-column label="Acciones" width="200">
        <template #default="scope">
          <el-button
            :type="scope.row.showing ? 'info' : 'primary'"
            @click="toggleShow(scope.row)"
          >
            {{ scope.row.showing ? 'Ocultar' : 'Mostrar' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "TablaPuntos",
  data() {
    return {
      tableData: Array.from({ length: 5 }, (_, i) => ({
        name: `Fila ${i + 1}`,
        value: Math.floor(Math.random() * 100),
        showing: false, // Controla el estado del botón
      })),
      broadcastChannel: null, // Canal de comunicación
    };
  },
  mounted() {
    // Crear el canal de comunicación con nombre 'appChannel'
    this.broadcastChannel = new BroadcastChannel('appChannel');
  },
  beforeDestroy() {
    // Cerrar el canal de comunicación cuando el componente se destruya
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
    }
  },
  methods: {
    toggleShow(row) {
      // Cambiar el estado del botón
      row.showing = !row.showing;

      // Enviar un mensaje al canal de comunicación
      const action = row.showing ? "Mostrar" : "Ocultar";
      this.broadcastChannel.postMessage({
        action,
        rowName: row.name,
        value: row.value,
      });

      console.log(`${action} para la fila:`, row.name);
    },
  },
};
</script>

<style>
/* Opcional: Estilo para ajustar el diseño */
</style>
