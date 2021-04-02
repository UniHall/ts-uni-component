import TsUniDrag from './src/TsUniDrag.vue';
(TsUniDrag as any).install = function(Vue: any) {
  Vue.component(TsUniDrag.name, TsUniDrag)
}
export default TsUniDrag
