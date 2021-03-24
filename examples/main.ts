import './assets/markdown.scss'
import Vue from 'vue'
import App from './App.vue'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import modules from '../packages'
import router from './route'
import demoBlock from './components/demo-block.vue'

Vue.component('demo-block', demoBlock)

Vue.config.productionTip = false
Vue.use(ElementUi)
Vue.use(modules)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
