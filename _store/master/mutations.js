export function RESET(state, data) {
  state.notifications = false
  state.unreadCount = 0
}

export function SET_NOTIFICATIONS(state, data) {
  state.notifications = data
}

export function SET_UNREAD_COUNT(state, data) {
  state.unreadCount = data
}
