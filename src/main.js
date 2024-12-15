import Vue from 'vue'
import App from './App.vue'
import SecondaryApp from './SecondaryApp.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './plugins/style'

Vue.config.productionTip = false
Vue.use(ElementUI);

// Montaje de la única instancia de Vue con ambos componentes

new Vue({
  router,
  render: h => h(App),  // La vista controladora
}).$mount('#app');

new Vue({
  router,
  render: h => h(SecondaryApp), // La vista secundaria con el router
}).$mount('#SecondaryApp');
