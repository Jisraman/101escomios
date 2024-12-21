import { defineStore } from 'pinia';

// Store para los equipos
export const useVistasStore = defineStore('vistas', {
  state: () => ({
    currentView: 'inicio'
  }),
  actions: {
    // Actualiza el nombre de un equipo
    actualizarVista(vista) {
      this.currentView = vista;
    },
  },
});

// Store para los equipos
export const useEquiposStore = defineStore('equipos', {
  state: () => ({
    equipoA: {
      nombre: 'Equipo Azul',
      puntuacion: 0,
    },
    equipoB: {
      nombre: 'Equipo Blue',
      puntuacion: 0,
    },
    acumulado : 0
  }),
  actions: {
    // Actualiza el nombre de un equipo
    setNombreEquipo(equipo, nuevoNombre) {
      if (equipo === 'A') {
        this.equipoA.nombre = nuevoNombre;
      } else if (equipo === 'B') {
        this.equipoB.nombre = nuevoNombre;
      }
    },
    // Actualiza la puntuación de un equipo
    actualizarPuntuacion(equipo, puntos) {
      if (equipo === 'A') {
        this.equipoA.puntuacion += puntos;
      } else if (equipo === 'B') {
        this.equipoB.puntuacion += puntos;
      }
    },
    // Reinicia las puntuaciones de ambos equipos
    reiniciarPuntuaciones() {
      this.equipoA.puntuacion = 0;
      this.equipoB.puntuacion = 0;
      this.acumulado = 0;
      this.equipoA.nombre = "";
      this.equipoB.nombre = "";
    },
    semiReiniciarPuntuaciones() {
      this.acumulado = 0;
    },
  },
});

// Store para las preguntas
export const usePreguntasStore = defineStore('preguntas', {
  state: () => ({
    pregunta: '',
    respuestas: [], // Array de respuestas [{ respuesta: 'Texto', popularidad: 90 }]
    seleccionada: null, // Índice de la respuesta seleccionada
  }),
  actions: {
    // Configura una nueva pregunta con respuestas
    setPregunta(nuevaPregunta) {
      this.pregunta = nuevaPregunta.pregunta;
      this.respuestas = nuevaPregunta.respuestas;
    },
    // Selecciona una respuesta
    seleccionarRespuesta(indice) {
      this.seleccionada = indice;
    },
    // Reinicia la pregunta
    reiniciarPregunta() {
      this.pregunta = '';
      this.respuestas = [];
      this.seleccionada = null;
    },
  },
});

// Store para las preguntas
export const useDataStore = defineStore('data', {
  state: () => ({
    preguntas: [],
  }),
  actions: {
    // Configura una nueva pregunta con respuestas
    setPreguntas(preguntas) {
      this.preguntas = preguntas;
    },
    // Selecciona una respuesta
    reiniciarPreguntas() {
      this.preguntas = [];
    },
  },
});
