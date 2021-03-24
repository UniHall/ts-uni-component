import TsVueTable from './src/TsVueTable.vue';
(TsVueTable as any).install = function(Vue: any) {
  Vue.component(TsVueTable.name, TsVueTable)
}
export default TsVueTable
