import input from '@/components/input/index'
import form from '@/components/form/index'
import test from '@/components/test/index'

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
      path: '/test',
      name: 'test',
      component: test
    }
  ];

export default routerConfig;

