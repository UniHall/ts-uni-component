import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
Vue.use(ElementUI, { size: 'small' })

import TsVueTable from '@/TsVueTable'
import './styles/common.scss'

const components = [TsVueTable]
const install = function(Vue: any) {
  if ((install as any).installed) return
  components.map(component => Vue.component(component.name, component))
}

if (typeof window !== 'undefined' && window.Vue) {
  install(Vue)
}
export { install, TsVueTable }
export default {
  install,
  ...components
}
