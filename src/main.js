import Vue from 'vue'
import App from './Calendar.vue'
import store from './store'
import './include.js'
import VModal from 'vue-js-modal'

Vue.config.productionTip = false
Vue.use(VModal)

new Vue({
  store,
  render: h => h(App)
}).$mount('#reachmedianetwork-app')
