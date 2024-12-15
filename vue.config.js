const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    index: {
      entry: 'src/main.js', // Archivo de entrada para la aplicación principal
      template: 'public/index.html', // Plantilla HTML principal
      filename: 'index.html', // Salida como index.html
    },
    secondary: {
      entry: 'src/main.js', // Archivo de entrada para la aplicación secundaria
      template: 'public/SecondaryApp.html', // Plantilla HTML secundaria
      filename: 'SecondaryApp.html', // Salida como secondary.html
    },
  },
});
