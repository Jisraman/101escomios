import Vue from 'vue';
import SecondaryApp from './SecondaryApp.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './plugins/style';
import './stores/store';
import esLocale from 'element-ui/lib/locale/lang/es'; // Importa el idioma español para Vue 2



Vue.config.productionTip = false;

// Usamos Element UI con la configuración de idioma en español
Vue.use(ElementUI, { locale: esLocale });


new Vue({
  render: h => h(SecondaryApp), // La vista secundaria con el router
}).$mount('#SecondaryApp');
