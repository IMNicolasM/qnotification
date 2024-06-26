export default {
  // Providers
  setting: {
    permission: 'notification.providers.manage',
    activated: true,
    path: '/notificaciones/configuracion',
    name: 'notification.admin.providers',
    layout: () => import('@imagina/qsite/_layouts/master'),
    page: () => import('@imagina/qnotification/_pages/admin/setting/index'),
    title: 'notification.cms.sidebar.adminProvider',
    icon: 'fa-light fa-bell-plus',
    authenticated: true,
    subHeader: {
      refresh: true,
    }
  },
  notification: {
    permission: 'notification.notifications.manage',
    activated: true,
    path: '/notifications/panel',
    name: 'notification.admin.notification',
    crud: import('@imagina/qnotification/_crud/notifications'),
    layout: () => import('@imagina/qsite/_layouts/master'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    title: 'notification.cms.sidebar.adminPanel',
    icon: 'fa-light fa-bell',
    authenticated: true,
    subHeader: {
      refresh: true,
    }
  }
}
