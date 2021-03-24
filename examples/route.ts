import VueRouter from 'vue-router'
import Vue from 'vue'
import HomePage from './docs/README.md'
import TsUniTableDoc from './docs/TsUniTable.md'

Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    redirect: '/ts-vue-component/describe',
    component: HomePage
  },
  {
    path: '/ts-vue-component/describe',
    component: HomePage
  },
  {
    path: '/ts-vue-component/component/ts-table',
    component: TsUniTableDoc,
    name: 'TsUniTableDoc'
  }
]
const router = new VueRouter({
  routes,
  mode: 'history'
})
export default router
