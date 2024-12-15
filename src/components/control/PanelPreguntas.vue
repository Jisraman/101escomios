<template>
    <div>
  
      <!-- Select -->
      <el-select v-model="selectedOption" placeholder="Selecciona una opción">
        <el-option v-for="option in options" :key="option" :label="option" :value="option" />
      </el-select>
  
      <!-- Tabla -->
      <el-table :data="tableData" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="name" label="Nombre" />
        <el-table-column prop="value" label="Valor" width="120" />
      </el-table>
  
      <!-- Botones -->
      <div style="margin-top: 20px;">
        <el-button
          v-for="(button, index) in buttons"
          :key="index"
          type="primary"
          :style="{ backgroundColor: button.active ? 'red' : '' }"
          @click="toggleButton(index)"
        >
          {{ button.label }}
        </el-button>
      </div>
  
      <!-- Botón de reproducción -->
      <div style="margin-top: 20px;">
        <el-button @click="playSong">Reproducir Canción</el-button>
      </div>
  
      <!-- Campos de texto -->
      <div style="margin-top: 20px;">
        <div v-for="(field, index) in textFields" :key="index" style="margin-bottom: 10px;">
          <el-input v-model="field.text" placeholder="Texto" />
          <div>
            <el-input-number v-model="field.number1" placeholder="Número 1" />
            <el-input-number v-model="field.number2" placeholder="Número 2" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedOption: null,
        options: ["Opción 1", "Opción 2", "Opción 3"],
        tableData: Array.from({ length: 5 }, (_, i) => ({
          name: `Fila ${i + 1}`,
          value: Math.floor(Math.random() * 100),
        })),
        buttons: [
          { label: "Botón 1", active: false },
          { label: "Botón 2", active: false },
        ],
        textFields: [
          { text: "", number1: null, number2: null },
          { text: "", number1: null, number2: null },
        ],
      };
    },
    methods: {
      toggleButton(index) {
        const button = this.buttons[index];
        button.active = !button.active;
        button.label = button.active ? "Activo" : `Botón ${index + 1}`;
      },
      playSong() {
        alert("Reproduciendo canción...");
      },
    },
  };
  </script>
  
  <style>
  .el-input-number {
    margin-right: 10px;
  }
  </style>
  