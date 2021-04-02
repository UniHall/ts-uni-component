import TsUniAnchor from './src/TsUniAnchor.vue';
(TsUniAnchor as any).install = function(Vue: any) {
  Vue.component(TsUniAnchor.name, TsUniAnchor)
}
export default TsUniAnchor
