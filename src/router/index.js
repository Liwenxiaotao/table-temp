import Vue from 'vue'
import Router from 'vue-router'
import table1 from '@/components/table1/index'
import table2 from '@/components/table2/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'table1',
      component: table1
    },
    {
      path: '/table1',
      name: 'table1',
      component: table1
    },
    {
      path: '/table2',
      name: 'table2',
      component: table2
    }
  ]
})
