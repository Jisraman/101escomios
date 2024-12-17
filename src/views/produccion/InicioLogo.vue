<template>
  <div class="background">
    <!-- Contenedor del Logo -->
    <div class="logo"></div>
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
  name: "AnimatedBackground",
  data() {
    return {
      sparkles: [], // Almacena puntos blancos en una cuadrícula
      rows: 15, // Número de filas
      cols: 15, // Número de columnas
    };
  },
  mounted() {
    // Generar puntos en cuadrícula al iniciar
    this.createGrid();

    // Empezar animaciones aleatorias
    this.startRandomAnimations();
  },
  methods: {
    createGrid() {
      const total = this.rows * this.cols; // Total de puntos
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
            top: `${row * cellHeight}%`, // Posición Y
            left: `${col * cellWidth}%`, // Posición X
            transition: "opacity 0.5s, transform 0.5s",
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
          sparkle.style.opacity = 0.6;
          sparkle.style.transform = "scale(1)";
        }, 500);
      }, 50); // Animar cada 100ms
    },
  },
};
</script>

<style scoped>
/* Fondo animado con degradado */
.background {
  position: fixed;
  width: 100%;
  height: 100vh;
  margin: 0px;
  overflow: hidden;
  /*background: linear-gradient(120deg, #ff0080, #8000ff);*/
  background: linear-gradient(120deg, #ff0080, #0000FF);
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

.logo {
  position: absolute;
  width: 735px; /* Ajusta el tamaño del logo */
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(255, 215, 0, 1) 30%,  /* Centro dorado */
    rgba(255, 193, 7, 1) 40%, /* Amarillo oscuro */
    rgba(255, 140, 0, 1) 80%, /* Naranja cálido */
    transparent 100%           /* Transición a transparente */
  );
  background-size: cover;
  z-index: 1; /* Mantener en el nivel más bajo */
  border-radius: 100%; /* Forma del óvalo */
  box-shadow: 
    inset 0 0 10px rgba(255, 255, 255, 0.4), /* Brillo interno */
    0 0 20px rgba(255, 255, 255, 0.3),       /* Resplandor externo tenue */
    0 0 60px rgba(255, 193, 7, 0.5);         /* Resplandor dorado más amplio */
  animation: glow 2s infinite alternate; /* Animación del resplandor */
}

/* Agrega una capa para la imagen */
.logo::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("../../assets/logoprograma2.png") no-repeat center center; /* Ruta de la imagen */
  background-size: contain; /* Ajusta el tamaño de la imagen */
  z-index: 2; /* Capa por encima del gradiente */
  border-radius: 100%; /* Asegura que sigue la forma del óvalo */
}


/* Animación de resplandor ajustada */
@keyframes glow {
  0% {
    box-shadow: 
      inset 0 0 10px rgba(255, 255, 255, 0.2),
      inset -5px -5px 20px rgba(255, 255, 255, 0.3),
      inset 5px 10px 30px rgba(255, 255, 255, 0.5),
      0 0 15px rgba(255, 255, 255, 0.4),
      0 0 40px rgba(255, 255, 255, 0.6);
  }
  25% {
    box-shadow: 
      inset 0 0 15px rgba(255, 255, 255, 0.4),
      inset -8px -8px 25px rgba(255, 255, 255, 0.3),
      inset 10px 15px 35px rgba(255, 255, 255, 0.7),
      0 0 20px rgba(255, 255, 255, 0.5),
      0 0 50px rgba(255, 255, 255, 0.7);
  }
  50% {
    box-shadow: 
      inset 0 0 20px rgba(255, 255, 255, 0.3),
      inset -10px -10px 30px rgba(255, 255, 255, 0.4),
      inset 15px 20px 40px rgba(255, 255, 255, 0.6),
      0 0 25px rgba(255, 255, 255, 0.6),
      0 0 60px rgba(255, 255, 255, 0.8);
  }
  75% {
    box-shadow: 
      inset 0 0 15px rgba(255, 255, 255, 0.5),
      inset -12px -12px 20px rgba(255, 255, 255, 0.3),
      inset 12px 18px 35px rgba(255, 255, 255, 0.5),
      0 0 30px rgba(255, 255, 255, 0.5),
      0 0 70px rgba(255, 255, 255, 0.9);
  }
  100% {
    box-shadow: 
      inset 0 0 10px rgba(255, 255, 255, 0.2),
      inset -5px -5px 20px rgba(255, 255, 255, 0.3),
      inset 5px 10px 30px rgba(255, 255, 255, 0.5),
      0 0 15px rgba(255, 255, 255, 0.4),
      0 0 40px rgba(255, 255, 255, 0.6);
  }
}



/* Contenedor de puntos */
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

/* Puntos animados */
.sparkle {
  will-change: opacity, transform;
  pointer-events: none;
  position: absolute;
}
</style>
