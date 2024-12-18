<template>
  <div class="sound-buttons-container">
    <div class="sound-section">
      <h2>Sonidos</h2>
      <div class="buttons-group">
        <button @click="playSound('inicio')" :disabled="isPlaying" class="btn">Inicio</button>
        <button @click="playSound('campana')" :disabled="isPlaying" class="btn">Campana</button>
        <button @click="playSound('mygotto')" :disabled="isPlaying" class="btn">Oh My Gotto</button>
        <button @click="playSound('feliz')" :disabled="isPlaying" class="btn">Feliz</button>
        <button @click="playSound('reloj')" :disabled="isPlaying" class="btn">Reloj</button>
        <button @click="playSound('duplicada')" :disabled="isPlaying" class="btn">Sonido Duplicado</button>
        <button @click="playSound('suspenso')" :disabled="isPlaying" class="btn">Suspenso</button>
      </div>
    </div>

    <div class="tache-section">
      <h2>Taches</h2>
      <div class="buttons-group">
        <button @click="playErrorSound(1)" :disabled="isPlaying" class="btn tache">❌</button>
        <button @click="playErrorSound(2)" :disabled="isPlaying" class="btn tache">❌❌</button>
        <button @click="playErrorSound(3)" :disabled="isPlaying" class="btn tache">❌❌❌</button>
      </div>
    </div>
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
        campana: require("../../assets/sounds/sonido_campana.mp3"),
        mygotto: require("../../assets/sounds/sonido_oh.mp3"),
        feliz: require("../../assets/sounds/sonido_feli.mp3"),
        suspenso: require("../../assets/sounds/sonido_suspenso.mp3"),
      },
      questionChannel: null,
      soundChannel: null,
      isPlaying: false,
    };
  },
  created() {
    this.questionChannel = new BroadcastChannel("question_channel");
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
      if (this.isPlaying) return;
      this.isPlaying = true;

      const audio = new Audio(this.sounds[soundKey]);
      audio.play();

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
    playSoundExternal(soundKey) {
      if (this.sounds[soundKey]) {
        const audio = new Audio(this.sounds[soundKey]);
        audio.play();
      }
    },
  },
  beforeDestroy() {
    if (this.questionChannel) this.questionChannel.close();
    if (this.soundChannel) this.soundChannel.close();
  },
};
</script>

<style scoped>
.sound-buttons-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 20px;
  max-width: 100%;
  margin: auto;
}

.sound-section,
.tache-section {
  width: 100%;
  text-align: center;
}

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.buttons-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
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
}
</style>
