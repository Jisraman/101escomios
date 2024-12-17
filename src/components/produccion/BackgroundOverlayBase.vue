<template>
  <div class="background">
    <!-- Tablero de puntos -->
    <div class="points-board">
      <h1>Tablero de Puntos</h1>
      <p>Puntos: {{ points }}</p>
    </div>

    <!-- Grid de puntos animados -->
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
  name: "TriviaBackground",
  data() {
    return {
      points: 0, // Puntos dinámicos
      sparkles: [], // Almacena puntos blancos en una cuadrícula
      rows: 15, // Número de filas
      cols: 15, // Número de columnas
    };
  },
  props: {
    initialPoints: {
      type: Number,
      default: 0,
    },
  },
  mounted() {
    this.points = this.initialPoints;

    // Generar puntos en cuadrícula al iniciar
    this.createGrid();

    // Empezar animaciones aleatorias
    this.startRandomAnimations();
  },
  methods: {
    createGrid() {
      const total = this.rows * this.cols ; // Total de puntos
      const cellWidth = 100 / this.cols; // Ancho de celda (%)
      const cellHeight = 100 / this.rows; // Altura de celda (%)

      for (let i = 0; i < total; i++) {
        const row = Math.floor(i / this.cols); // Fila actual
        const col = i % this.cols; // Columna actual

        const sparkle = {
          style: {
            width: "10px",
            height: "10px",
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
            position: "absolute",
            top: `${row * cellHeight}%`, // Posición Y en base a la fila
            left: `${col * cellWidth}%`, // Posición X en base a la columna
            transition: "opacity 0.5s, transform 0.5s", // Suaviza cambios
            opacity: 0.6, // Inicialmente tenue
          },
        };

        this.sparkles.push(sparkle);
      }
    },
    startRandomAnimations() {
      setInterval(() => {
        // Seleccionar un punto aleatorio para animar
        const randomIndex = Math.floor(Math.random() * this.sparkles.length);
        const sparkle = this.sparkles[randomIndex];

        // Cambiar aleatoriamente el brillo y tamaño
        sparkle.style.opacity = Math.random() * 0.8 + 0.8; // Más brillante
        sparkle.style.transform = `scale(${Math.random() * 0.8 + 1})`;

        // Volver al estado inicial después de un tiempo
        setTimeout(() => {
          sparkle.style.opacity = 0.6; // Regresar al estado tenue
          sparkle.style.transform = "scale(1)"; // Escala normal
        }, 500);
      }, 5); // Cambiar un punto cada 300ms
    },
  },
};
</script>

<style scoped>
/* Fondo animado con degradado */
.background {
  position:fixed;
  width: 100%;
  height: 100vh;
  margin: 0px !important;
  overflow: hidden !important;
  background: linear-gradient(120deg, #ff0080, #8000ff);
  background-size: 200% 200%;
  animation: gradientAnimation 4s ease infinite;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Animación del degradado */
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

/* Tablero de puntos */
.points-board {
  position: relative;
  width: 50%;
  max-width: 600px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 20px;
  text-align: center;
  color: white;
  font-family: "Arial", sans-serif;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  z-index: 2;
  overflow-y: hidden !important;
  

}

.points-board h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.points-board p {
  font-size: 1.5rem;
  margin: 0;
}

/* Contenedor para los puntos */
.grid-container {
  position: absolute;
  width: 100%;
  height: 100%;
  align-items: center;
  align-content: center;
  margin-left: 80px;
  pointer-events: none; /* Los puntos no interfieren con los clics */
  overflow-y: hidden !important;

}

/* Puntos animados */
.sparkle {
  will-change: opacity, transform;
  pointer-events: none;
  position: absolute;
}
</style>
