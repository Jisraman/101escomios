<template>
  <div class="background">
    <!-- Logo del juego -->
    <div class="logo-container">
      <img src="@/assets/logoprograma2.png" alt="Logo del Juego" class="game-logo" />
    </div>

    <!-- Contenedor principal del tablero -->
    <div class="board">
      <!-- Puntuaciones de los equipos -->
      <div class="scores">
        <div class="team left">
          <p>{{ equipoA.nombre }}</p>
          <p>{{ equipoA.puntuacion }}</p>
        </div>
        <div class="team right">
          <p>{{ equipoB.nombre }}</p>
          <p>{{ equipoB.puntuacion }}</p>
        </div>
      </div>

      <!-- Pregunta actual -->
      <div class="question">
        <h1 v-if="pregunta">{{ pregunta }}</h1>
        <h1 v-else>Esperando pregunta...</h1>
      </div>

      <!-- Respuestas -->
      <div class="answers">
        <div v-if="respuestas.length === 0" class="placeholder">
          <p>No hay respuestas disponibles aún</p>
        </div>
        <div 
          v-for="(respuesta, index) in respuestas" 
          :key="index" 
          class="answer" 
          :class="{ revealed: respuesta.mostrar }"
        >
          <span>{{ respuesta.respuesta }}</span>
          <span v-if="respuesta.mostrar">({{ respuesta.popularidad }})</span>
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
      equipoA: { nombre: "Equipo A", puntuacion: 0 },
      equipoB: { nombre: "Equipo B", puntuacion: 0 },
      pregunta: "Esperando pregunta...",
      respuestas: [],
      sparkles: [],
      rows: 15,
      cols: 15,
    };
  },
  mounted() {
    this.createGrid();
    this.startRandomAnimations();

    // Crear el canal de comunicación
    this.broadcastChannel = new BroadcastChannel("question_channel");

    // Escuchar los mensajes enviados por el primer componente
    this.broadcastChannel.onmessage = (event) => {
      if (event.data.action === "reset") {
        this.resetBoard();
      }

      if (event.data.equiposNombres) {
        this.equipoA.nombre = event.data.equiposNombres.equipoA;
        this.equipoB.nombre = event.data.equiposNombres.equipoB;
        console.log("Nombres de equipos actualizados");
      }

      if (event.data.equipoA) {
        this.equipoA.nombre = event.data.equipoA.nombre;
        this.equipoA.puntuacion = event.data.equipoA.puntuacion;
      }

      if (event.data.equipoB) {
        this.equipoB.nombre = event.data.equipoB.nombre;
        this.equipoB.puntuacion = event.data.equipoB.puntuacion;
      }

      if (event.data.pregunta) {
        this.pregunta = event.data.pregunta;
      }

      if (event.data.respuestas) {
        this.respuestas = event.data.respuestas;
      }

      if (event.data.index) {
        this.revelarRespuesta(event.data.index - 1);
      }
    };
  },
  methods: {
    revelarRespuesta(indiceRespuesta) {
      if (this.respuestas[indiceRespuesta]) {
        this.$set(this.respuestas, indiceRespuesta, {
          ...this.respuestas[indiceRespuesta],
          mostrar: true,
        });
      }
    },
    resetBoard() {
      this.equipoA.puntuacion = 0;
      this.equipoB.puntuacion = 0;
      this.pregunta = "Esperando pregunta...";
      this.respuestas = [];
    },
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
            opacity: 0.6,
            transition: "opacity 0.5s, transform 0.5s",
          },
        };

        this.sparkles.push(sparkle);
      }
    },
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

/* Logo del juego con brillo */
.logo-container {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  scale: 1.2;
}

.game-logo {
  width: 150px;
  height: auto;
  border: 5px solid gold;
  border-radius: 50%;
  animation: glow 1.5s infinite alternate;
}

@keyframes glow {
  0% {
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.7);
  }
  100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.9), 0 0 60px rgba(255, 215, 0, 1);
  }
}

/* Tablero */
.board {
  position: relative;
  width: 80%;
  max-width: 700px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 20px;
  padding: 20px;
  margin-top: 100px;
  color: white;
  font-family: "Arial", sans-serif;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  z-index: 2;
  text-align: center;
  border: 5px solid gold;
}

/* Puntuaciones como tarjetas laterales */
.team {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 10px 20px;
  border-radius: 10px;
  color: white;
  font-size: 1.2rem;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border: 3px solid gold;
}

.team.left {
  left: -150px;
}

.team.right {
  right: -150px;
}

.question h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.answers {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.answer {
  display: flex;
  justify-content: space-between;
  font-size: 1.5rem;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  transition: transform 0.5s, opacity 0.5s;
  opacity: 0;
  transform: translateX(-100%);
}

.answer.revealed {
  opacity: 1;
  transform: translateX(0);
  background: rgba(255, 255, 255, 0.3);
}

.placeholder {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Efectos de puntos brillantes */
/* Efectos de puntos brillantes */
.grid-container {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 75px;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.sparkle {
  will-change: opacity, transform;
  pointer-events: none;
  position: absolute;
}
</style>
