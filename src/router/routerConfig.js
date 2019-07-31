import input from '@/components/input/index'
import form from '@/components/form/index'
import test from '@/components/test/index'
import button from '@/components/button/index'
import radio from '@/components/radio/index'

const routerConfig = [
  {
    path: '/',
    name: '/',
    component: input
  },
  {
    path: '/input',
    name: 'input',
    component: input
  },
  {
    path: '/form',
    name: 'form',
    component: form
  },
  {
    path: '/button',
    name: 'button',
    component: button
  },
  {
    path: '/radio',
    name: 'radio',
    component: radio
  },
  {
    path: '/test',
    name: 'test',
    component: test
  }
]

export default routerConfig
