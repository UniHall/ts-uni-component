import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
Vue.use(ElementUI, { size: 'small' })
import './styles/common.scss'

import TsUniTable from '@/TsUniTable'
import TsUniAnchor from '@/TsUniAnchor'
import TsUniDrag from '@/TsUniDrag'
import TsUniDragGroup from '@/TsUniDragGroup'

const components = [TsUniTable, TsUniAnchor, TsUniDrag, TsUniDragGroup]
const install = function(Vue: any) {
  if ((install as any).installed) return
  components.map(component => Vue.component(component.name, component))
}

if (typeof window !== 'undefined' && window.Vue) {
  install(Vue)
}
export { install, TsUniTable, TsUniAnchor, TsUniDrag, TsUniDragGroup }
export default {
  install,
  ...components
}
