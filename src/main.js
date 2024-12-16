import Vue from 'vue'
import App from './App.vue'
import SecondaryApp from './SecondaryApp.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './plugins/style'
import { createPinia, PiniaVuePlugin } from 'pinia'
import './stores/store'


Vue.use(PiniaVuePlugin)
const pinia = createPinia()


Vue.config.productionTip = false
Vue.use(ElementUI);


// Montaje de la única instancia de Vue con ambos componentes

new Vue({
  pinia,
  render: h => h(App),  // La vista controladora
}).$mount('#app');

new Vue({
  pinia,
  render: h => h(SecondaryApp), // La vista secundaria con el router
}).$mount('#SecondaryApp');
