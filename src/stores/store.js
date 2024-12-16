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
      nombre: 'Equipo A',
      puntuacion: 0,
    },
    equipoB: {
      nombre: 'Equipo B',
      puntuacion: 0,
    },
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
    },
  },
});

// Store para las preguntas
export const usePreguntasStore = defineStore('preguntas', {
  state: () => ({
    pregunta: '',
    respuestas: [], // Array de respuestas [{ texto: 'Respuesta 1', puntuacion: 10 }, ...]
    seleccionada: null, // Índice de la respuesta seleccionada
  }),
  actions: {
    // Configura una nueva pregunta con respuestas
    setPregunta(nuevaPregunta, nuevasRespuestas) {
      this.pregunta = nuevaPregunta;
      this.respuestas = nuevasRespuestas.map((respuesta, index) => ({
        texto: respuesta.texto,
        puntuacion: respuesta.puntuacion,
        id: index,
      }));
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
    // Acciones relacionadas con sonidos o animaciones
    reproducirSonido(sonido) {
      console.log(`Reproduciendo sonido: ${sonido}`);
      // Aquí podrías integrar librerías como Howler.js para reproducir sonidos
    },
    mostrarAnimacion(animacion) {
      console.log(`Mostrando animación: ${animacion}`);
      // Aquí puedes disparar alguna animación en tu componente Vue
    },
  },
});
