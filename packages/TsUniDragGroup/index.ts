import TsUniDragGroup from './src/TsUniDragGroup.vue';
(TsUniDragGroup as any).install = function(Vue: any) {
  Vue.component(TsUniDragGroup.name, TsUniDragGroup)
}
export default TsUniDragGroup
