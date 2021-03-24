import VueRouter from 'vue-router'
import Vue from 'vue'
import HomePage from './docs/README.md'
import TsVueTableDoc from './docs/TsVueTable.md'

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
    component: TsVueTableDoc,
    name: 'TsVueTableDoc'
  }
]
const router = new VueRouter({
  routes,
  mode: 'history'
})
export default router
