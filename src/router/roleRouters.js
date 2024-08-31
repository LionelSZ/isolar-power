import Layout from '@/layout'
export default [
  {
    path: '',
    component: Layout,
    redirect: '/role-manage',
    children: [
      {
        path: '/role-manage',
        component: () => import('@/views/system/role_temp/index'),
        name: 'roleManage',
        meta: { title: '角色管理', icon: 'dashboard', affix: true }
      }
    ]
  }
]