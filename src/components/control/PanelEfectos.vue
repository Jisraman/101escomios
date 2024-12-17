<template>
    <div class="sound-buttons">
      <!-- Botones de sonidos -->
      <button
        @click="playSound('inicio')"
        :disabled="isPlaying"
        class="btn"
      >
        Sonido de Inicio
      </button>
      <button
        @click="playSound('reloj');"
        :disabled="isPlaying"
        class="btn"
      >
        Reloj
      </button>
  
      <!-- Botones de Taches -->
      <button
        @click="playErrorSound(1)"
        :disabled="isPlaying"
        class="btn tache"
      >
        ❌
      </button>
      <button
        @click="playErrorSound(2)"
        :disabled="isPlaying"
        class="btn tache"
      >
        ❌❌
      </button>
      <button
        @click="playErrorSound(3)"
        :disabled="isPlaying"
        class="btn tache"
      >
        ❌❌❌
      </button>

      <button
        @click="playSound('duplicada')"
        :disabled="isPlaying"
        class="btn"
      >
        Sonido duplicado
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: "SoundButtons",
    data() {
      return {
        sounds: {
          inicio: require("../../assets/sounds/sonido_inicio.mp3"),
          reloj: require("../../assets/sounds/sonido_reloj.mp3"),
          punto: require("../../assets/sounds/sonido_correcto.mp3"),
          ganador: require("../../assets/sounds/sonido_ganador.mp3"),
          tache: require("../../assets/sounds/sonido_incorrecto.mp3"),
          duplicada: require("../../assets/sounds/sonido_ambiguo.mp3"),
        },
        questionChannel: null, // Canal de comunicación principal
        soundChannel: null, // Canal de sonido que escucha mensajes activamente
        isPlaying: false, // Estado para bloquear botones durante la reproducción
      };
    },
    created() {
      // Inicializar el BroadcastChannel principal
      this.questionChannel = new BroadcastChannel("question_channel");
  
      // Inicializar y escuchar el canal de sonido
      this.soundChannel = new BroadcastChannel("sound_channel");
      this.soundChannel.onmessage = (event) => {
        const { sound } = event.data;
        if (sound) {
          this.playSoundExternal(sound);
        }
      };
    },
    methods: {
      playSound(soundKey) {
        if (this.isPlaying) return; // Evita sonidos simultáneos
        this.isPlaying = true;
  
        const audio = new Audio(this.sounds[soundKey]);
        audio.play();
  
        // Enviar un mensaje de temporizador al canal principal si el sonido es "reloj"
        if (soundKey === "reloj") {
          this.questionChannel.postMessage({ temporizador: 5 });
  
          setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
            this.isPlaying = false;
          }, 5000);
        } else {
          audio.onended = () => {
            this.isPlaying = false;
          };
        }
      },
      playErrorSound(errorNumber) {
        if (this.isPlaying) return;
        this.isPlaying = true;
  
        const audio = new Audio(this.sounds.tache);
        audio.play();
  
        this.questionChannel.postMessage({ error: errorNumber });
  
        audio.onended = () => {
          this.isPlaying = false;
        };
      },
      // Reproduce sonidos desde el canal sound_channel
      playSoundExternal(soundKey) {
        if (this.sounds[soundKey]) {
          const audio = new Audio(this.sounds[soundKey]);
          audio.play();
        }
      },
    },
    beforeDestroy() {
      // Cerrar canales al destruir el componente
      if (this.questionChannel) this.questionChannel.close();
      if (this.soundChannel) this.soundChannel.close();
    },
  };
  </script>
  
  <style scoped>
  .sound-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 15px;
    padding: 20px;
  }
  
  .btn {
    width: 150px;
    padding: 10px;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background-color: #4caf50;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s;
    text-align: center;
  }
  
  .btn:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }
  
  .btn:disabled {
    background-color: #b2b2b2;
    cursor: not-allowed;
  }
  
  .btn.tache {
    background-color: #ff3333;
  }
  
  .btn.tache:hover {
    background-color: #e62e2e;
  }
  
  .btn.tache:disabled {
    background-color: #b2b2b2;
    cursor: not-allowed;
  }
  </style>
  