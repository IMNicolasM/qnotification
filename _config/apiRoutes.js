const moduleName = 'notification';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`

export default {
  urlBase : urlBase,
  version: moduleVersion,
  notifications : `${urlBase}/notifications`,
  markRead : `${urlBase}/notifications/mark-read`,
  markAllAsRead:  `${urlBase}/notifications/mark-all-as-read`,
  providers : `${urlBase}/providers`,
  rules : `${urlBase}/rules`,
  rulesConfig : `${urlBase}/rules/config`,
  devices: `${urlBase}/devices`
}
