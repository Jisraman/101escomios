<template>
  <div class="background">
    <!-- Contenedor principal del tablero -->
    <div class="board">
      <!-- Puntuaciones de los equipos -->
      <div class="scores">
        <div class="team">
          <h2>{{ equipoA.nombre }}</h2>
          <p>{{ equipoA.puntuacion }}</p>
        </div>
        <div class="team">
          <h2>{{ equipoB.nombre }}</h2>
          <p>{{ equipoB.puntuacion }}</p>
        </div>
      </div>

      <!-- Pregunta actual -->
      <div class="question">
        <h1>{{ pregunta }}</h1>
      </div>

      <!-- Respuestas -->
      <div class="answers">
        <div 
          v-for="(respuesta, index) in respuestas" 
          :key="index" 
          class="answer" 
          :class="{ revealed: respuesta.mostrar }"
        >
          <span>{{ respuesta.texto }}</span> <!-- Respuesta a la izquierda -->
          <span v-if="respuesta.mostrar">({{ respuesta.puntos }})</span> <!-- Puntaje a la derecha -->
        </div>
      </div>

    </div>

    <!-- Efectos de puntos brillantes -->
    <div class="grid-container">
      <div
        v-for="(sparkle, index) in sparkles"
        :key="index"
        class="sparkle"
        :style="sparkle.style"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TriviaBoard",
  data() {
    return {
      // Equipos y sus puntos
      equipoA: { nombre: "Equipo A", puntuacion: 0 },
      equipoB: { nombre: "Equipo B", puntuacion: 0 },
      // Pregunta actual
      pregunta: "¿Cuál es la capital de Francia?",
      // Respuestas y si están reveladas
      respuestas: [
        { texto: "París", puntos: 50, mostrar: false },
        { texto: "Marsella", puntos: 30, mostrar: false },
        { texto: "Lyon", puntos: 20, mostrar: false },
        { texto: "Toulouse", puntos: 10, mostrar: false },
        { texto: "Niza", puntos: 5, mostrar: false },
      ],
      // Animación de puntos brillantes
      sparkles: [],
      rows: 15,
      cols: 15,
    };
  },
  mounted() {
    this.createGrid();
    this.startRandomAnimations();
    // Probar revelación de respuestas con un retraso
  setTimeout(() => {
    this.revelarRespuesta(0); // Revelar la primera respuesta (índice 0)
    setTimeout(() => {
      this.revelarRespuesta(2); // Revelar la tercera respuesta (índice 2) después
    }, 1000); // Segundo retraso para la siguiente respuesta
  }, 1000);
  },
  methods: {
    // Revelar una respuesta específica
    revelarRespuesta(indiceRespuesta) {
      if (this.respuestas[indiceRespuesta]) {
        this.$set(this.respuestas, indiceRespuesta, {
          ...this.respuestas[indiceRespuesta],
          mostrar: true,
        });
      }
    },

    // Cambiar la pregunta
    mostrarPregunta(nuevaPregunta, nuevasRespuestas) {
      this.pregunta = nuevaPregunta;
      this.respuestas = nuevasRespuestas.map((respuesta) => ({
        texto: respuesta.texto,
        puntos: respuesta.puntos,
        mostrar: false,
      }));
    },
    // Crear puntos brillantes en el fondo
    createGrid() {
      const total = this.rows * this.cols;
      const cellWidth = 100 / this.cols;
      const cellHeight = 100 / this.rows;

      for (let i = 0; i < total; i++) {
        const row = Math.floor(i / this.cols);
        const col = i % this.cols;

        const sparkle = {
          style: {
            width: "10px",
            height: "10px",
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
            position: "absolute",
            top: `${row * cellHeight}%`,
            left: `${col * cellWidth}%`,
            transition: "opacity 0.5s, transform 0.5s",
            opacity: 0.6,
          },
        };

        this.sparkles.push(sparkle);
      }
    },
    // Animaciones aleatorias de los puntos brillantes
    startRandomAnimations() {
      setInterval(() => {
        const randomIndex = Math.floor(Math.random() * this.sparkles.length);
        const sparkle = this.sparkles[randomIndex];

        sparkle.style.opacity = Math.random() * 0.8 + 0.8;
        sparkle.style.transform = `scale(${Math.random() * 0.8 + 1})`;

        setTimeout(() => {
          sparkle.style.opacity = 0.6;
          sparkle.style.transform = "scale(1)";
        }, 500);
      }, 300);
    },
  },
};
</script>

<style scoped>
/* Fondo animado */
.background {
  position: fixed;
  width: 100%;
  height: 100vh;
  margin: 0;
  overflow: hidden;
  background: linear-gradient(120deg, #ff0080, #8000ff);
  background-size: 200% 200%;
  animation: gradientAnimation 4s ease infinite;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Animación de degradado */
@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Contenedor del tablero */
.board {
  position: relative;
  width: 60%;
  max-width: 800px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 20px;
  padding: 20px;
  color: white;
  font-family: "Arial", sans-serif;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  z-index: 2;
  text-align: center;
  border: 5px solid gold; /* Marco dorado */
  opacity: 1; /* Visibilidad completa */
}


/* Sección de puntuaciones */
.scores {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.team h2 {
  margin: 0;
  font-size: 1.5rem;
}

.team p {
  font-size: 1.2rem;
  margin: 0;
}

/* Pregunta */
.question h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}

/* Respuestas */
.answers {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@keyframes revealAnimation {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.answer {
  display: flex;
  justify-content: space-between; /* Para alinear respuesta y puntaje */
  align-items: center;
  font-size: 1.5rem;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  opacity: 0; /* Totalmente invisible al inicio */
  transform: translateX(-100%); /* Fuera del área visible */
  overflow: hidden; /* Evitar que contenido sobresalga */
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.answer.revealed {
  opacity: 1; /* Mostrar respuesta */
  transform: translateX(0); /* Mover a su posición */
  background: rgba(255, 255, 255, 0.3); /* Fondo más visible */
}

.answer span:first-child {
  flex: 1; /* La respuesta ocupa todo el espacio disponible */
  text-align: left; /* Alineación a la izquierda */
}

.answer span:last-child {
  text-align: right; /* Puntaje a la derecha */
  margin-left: 20px;
  white-space: nowrap; /* Evitar que el puntaje se rompa en líneas */
}



/* Puntos brillantes */
.grid-container {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sparkle {
  will-change: opacity, transform;
  pointer-events: none;
  position: absolute;
}
</style>
