<template>
  <div>
    <!-- Select y Botón Siguiente -->
    <div style="display: flex; margin-left: auto; margin-right: auto; width: 70%;">
      <el-select
        v-model="selectedOption"
        placeholder="Selecciona una Pregunta"
        style="margin-right: auto; width: 80%;"
      >
        <el-option 
          v-for="(option, index) in options" 
          :key="index" 
          :label="option.pregunta" 
          :value="option.pregunta" 
        />
      </el-select>
      <el-button type="primary" @click="goToNextOption">Siguiente</el-button>

      <el-button type="primary" @click="showQuestion" >
        Mostrar
      </el-button>
    </div>

    <!-- Tabla -->
    <el-table :data="tableData" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="respuesta" label="Respuesta" />
      <el-table-column prop="popularidad" label="Popularidad" />
      <!-- Columna personalizada para acciones -->
      <el-table-column label="Acciones" width="600">
        <template #default="scope">
          <el-button
            :type="scope.row.showing ? 'info' : 'primary'"
            @click="toggleShow(scope.row); showAnswer(scope.$index)"
            :disabled="scope.row.showing"
          >
            {{ scope.row.showing ? 'Ocultar en tablero' : 'Mostrar en tablero' }}
          </el-button>
          <el-button
            type="danger"
            @click="sumarEquipoA(scope.$index)" 
            :disabled="!scope.row.showing || scope.row.equipoB_pulsado || scope.row.equipoA_pulsado"
          >
            Equipo A
          </el-button>
          <el-button
            type="success"
            @click="sumarEquipoB(scope.$index)" 
            :disabled="!scope.row.showing || scope.row.equipoA_pulsado || scope.row.equipoB_pulsado"
          >
            Equipo B
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { preguntas } from '../../stores/preguntas'
import { usePreguntasStore } from '../../stores/store'
import { useEquiposStore } from '../../stores/store'

export default {
  name: "TablaPuntos",
  data() {
    return {
      selectedOption: null, // Opción seleccionada
      options: [...preguntas],  // Lista de preguntas
      tableData: [],  // Inicializamos la tabla vacía
      storePreguntas: usePreguntasStore(),
      storeEquipos: useEquiposStore(),
      showQuestionClicked: false,  // Para saber si se mostró la pregunta
    };
  },
  mounted() {
    console.log(preguntas)
  },
  methods: {
    toggleShow(row) {
      // Cambiar el estado del botón
      row.showing = !row.showing;

      // Enviar un mensaje al canal de comunicación
      const action = row.showing ? "Mostrar" : "Mostrada";
      console.log(`${action} para la fila:`, row.respuesta);
    },
    goToNextOption() {
      const currentIndex = this.options.findIndex(option => option.pregunta === this.selectedOption);
      const nextIndex = (currentIndex + 1) % this.options.length;
      this.selectedOption = this.options[nextIndex].pregunta;
      console.log(`Opción seleccionada: ${this.selectedOption}`);
    },
    showQuestion() {
      const selectedQuestion = this.options.find(option => option.pregunta === this.selectedOption);

      if (selectedQuestion) {
        this.tableData = selectedQuestion.respuestas.map((respuesta) => ({
          respuesta: respuesta.respuesta,
          popularidad: respuesta.popularidad,
          showing: false,
          equipoA_pulsado: false, // Estado de si se pulsó equipoA
          equipoB_pulsado: false, // Estado de si se pulsó equipoB
        }));
        this.storePreguntas.setPregunta(selectedQuestion);
        this.showQuestionClicked = true;  // Se activó el clic en Mostrar

        // Enviar la pregunta al BroadcastChannel
        if (!this.broadcastChannel) {
          this.broadcastChannel = new BroadcastChannel('question_channel');
        }

        // Enviar la pregunta a través del canal
        this.broadcastChannel.postMessage({
          pregunta: selectedQuestion.pregunta,
          respuestas: selectedQuestion.respuestas,
        });

        console.log("Pregunta enviada:", selectedQuestion.pregunta);
        console.log("Respuestas:", selectedQuestion.respuestas);
      }
    },
    showAnswer(indice) {
      // Enviar el índice de la respuesta seleccionada al canal
      this.broadcastChannel.postMessage({
        action: "mostrar_respuesta",
        index: indice + 1, // Enviar el índice del botón presionado
      });

      console.log(`Mostrar respuesta en el índice: ${indice}`);
    },
    sumarEquipoA(index) {
      if (this.tableData[index].equipoB_pulsado) return; // Si ya se pulsó equipo B, no permitir pulsar equipo A

      console.log("SUMANDO PUNTOS A");
      console.log(this.storePreguntas.respuestas[index].popularidad);
      console.log(this.storeEquipos.equipoA.puntuacion);

      this.storeEquipos.actualizarPuntuacion('A', this.storePreguntas.respuestas[index].popularidad);
      this.broadcastChannel.postMessage({
        action: "actualizarPuntuacion",
        equipoA: {
          nombre: this.storeEquipos.equipoA.nombre,
          puntuacion: this.storeEquipos.equipoA.puntuacion,
        }
      });

      // Marcar que se pulsó el botón de equipoA
      this.tableData[index].equipoA_pulsado = true;
    },
    sumarEquipoB(index) {
      if (this.tableData[index].equipoA_pulsado) return; // Si ya se pulsó equipo A, no permitir pulsar equipo B

      console.log("SUMANDO PUNTOS B");
      console.log(this.storePreguntas.respuestas[index].popularidad);
      console.log(this.storeEquipos.equipoB.puntuacion);

      this.storeEquipos.actualizarPuntuacion('B', this.storePreguntas.respuestas[index].popularidad);
      this.broadcastChannel.postMessage({
        action: "actualizarPuntuacion",
        equipoB: {
          nombre: this.storeEquipos.equipoB.nombre,
          puntuacion: this.storeEquipos.equipoB.puntuacion,
        }
      });

      // Marcar que se pulsó el botón de equipoB
      this.tableData[index].equipoB_pulsado = true;
    }
  }
};
</script>

<style scoped>
/* Opcional: Estilo para ajustar el diseño */
</style>
