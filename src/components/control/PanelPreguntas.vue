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

      <el-button type="primary" @click="showQuestion">
        Seleccionar
      </el-button>
    </div>

    <!-- Tabla -->
    <el-table :data="tableData" style="width: 100%; margin-top: 20px;">
      <el-table-column 
        prop="respuesta" 
        label="Respuesta" 
        :label-class-name="'center-header'" 
      />
      <el-table-column 
        prop="popularidad" 
        label="Popularidad" 
        :label-class-name="'center-header'" 
      />
      <!-- Columna personalizada para acciones -->
      <el-table-column label="Acciones" width="300" :label-class-name="'center-header'">
        <template #default="scope">
          <el-button
            :type="scope.row.showing ? 'info' : 'primary'"
            @click="toggleShow(scope.row)"
            :disabled="scope.row.showing "
          >
            {{ scope.row.showing ? `${scope.$index + 1} Mostrado` : `${scope.$index + 1} Mostrar` }}
          </el-button>
          <el-button
            :type="scope.row.showing && !scope.row.summed ? 'primary' : 'info'"
            @click="sumResult(scope.row)"
            :disabled="!scope.row.showing || scope.row.summed || botonesDeshabilitados"
          >
            {{ scope.row.showing && !scope.row.summed ? 'R'+`${scope.$index + 1}: +${scope.row.popularidad}` : `${scope.$index + 1} ✓` }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Botones para enviar puntajes acumulados -->
    <div style="margin-top: 20px; text-align: center;">
      <el-button type="primary" @click="enviarPuntaje('A')" :disabled="!showQuestionClicked || botonesDeshabilitados">
        Enviar Puntaje Equipo 1
      </el-button>
      <el-button type="primary" @click="enviarPuntaje('B')" :disabled="!showQuestionClicked || botonesDeshabilitados">
        Enviar Puntaje Equipo 2
      </el-button>
    </div>
  </div>
</template>

<script>
import { preguntas } from '../../stores/preguntas';
import { usePreguntasStore } from '../../stores/store';
import { useEquiposStore } from '../../stores/store';

export default {
  name: "TablaPuntos",
  data() {
    return {
      selectedOption: null,           // Opción seleccionada
      options: [...preguntas],        // Lista de preguntas
      tableData: [],                  // Datos para la tabla
      storePreguntas: usePreguntasStore(),
      storeEquipos: useEquiposStore(),
      showQuestionClicked: false,     // Para saber si se mostró la pregunta
      broadcastChannel: null,         // Canal de comunicación
      soundChannel: null,             // Canal para el sonido
      acumulado: 0,                   // Puntaje acumulado
      botonesDeshabilitados: false    // Estado para deshabilitar botones
    };
  },
  mounted() {
    // Inicializar canales si no existen
    if (!this.broadcastChannel) {
      this.broadcastChannel = new BroadcastChannel('question_channel');
    }
    if (!this.soundChannel) {
      this.soundChannel = new BroadcastChannel('sound_channel');
    }
  },
  methods: {
    toggleShow(row) {
      row.showing = !row.showing;
      if (row.showing) {
        this.broadcastChannel.postMessage({
          action: "mostrar_respuesta",
          index: this.tableData.indexOf(row) + 1,
        });
        this.soundChannel.postMessage({ sound: "punto" });
      }
      console.log(`Estado de fila cambiado: ${row.respuesta}`);
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
          summed: false,  // Nueva propiedad para saber si ya se sumaron los puntos
        }));

        this.storePreguntas.setPregunta(selectedQuestion);
        this.showQuestionClicked = true;

        // Habilitar los botones nuevamente
        this.botonesDeshabilitados = false;

        // Enviar pregunta al canal principal
        this.broadcastChannel.postMessage({
          pregunta: selectedQuestion.pregunta,
          respuestas: selectedQuestion.respuestas,
        });

        console.log("Pregunta enviada:", selectedQuestion.pregunta);
      }
    },
    sumResult(row) {
      if (row.showing && !row.summed) {
        this.acumulado += row.popularidad;
        row.summed = true; // Marcar que los puntos ya fueron sumados para esa fila

        this.broadcastChannel.postMessage({
          action: "sumar_puntos",
          acumulado: this.acumulado,
        });

        console.log(`Puntos sumados: ${row.popularidad}, Acumulado: ${this.acumulado}`);
      }
    },
    enviarPuntaje(equipo) {
      this.soundChannel.postMessage({ sound: "ganador" });
      if (equipo === 'A') {
        this.storeEquipos.actualizarPuntuacion('A', this.acumulado);
        this.broadcastChannel.postMessage({
          action: "actualizarPuntuacion",
          equipoA: {
            nombre: this.storeEquipos.equipoA.nombre,
            puntuacion: this.storeEquipos.equipoA.puntuacion,
          },
          acumulado:'cero'
        });
        console.log(`Puntaje del Equipo Azul enviado: ${this.acumulado}`);
      } else if (equipo === 'B') {
        this.storeEquipos.actualizarPuntuacion('B', this.acumulado);
        this.broadcastChannel.postMessage({
          action: "actualizarPuntuacion",
          equipoB: {
            nombre: this.storeEquipos.equipoB.nombre,
            puntuacion: this.storeEquipos.equipoB.puntuacion,
          },
          acumulado:'cero'

        });
        console.log(`Puntaje del Equipo Blue enviado: ${this.acumulado}`);
      }

      // Resetear el acumulado y deshabilitar los botones de sumar
      this.acumulado = 0;
      this.botonesDeshabilitados = true;
      this.broadcastChannel.postMessage({ acumulado: this.acumulado });
    }
  }
};
</script>

<style scoped>
/* Opcional: Estilo para ajustar el diseño */
</style>
