import TsUniTable from './src/TsUniTable.vue';
(TsUniTable as any).install = function(Vue: any) {
  Vue.component(TsUniTable.name, TsUniTable)
}
export default TsUniTable
