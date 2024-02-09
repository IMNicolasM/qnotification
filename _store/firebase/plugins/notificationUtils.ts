import moment from 'moment';
import Vue, { computed, ComputedRef } from 'vue';
import store from 'modules/qnotification/_store/firebase';
import { MessagePayload } from "firebase/messaging";

/**
 * Displays a notification on the user interface and sends a push notification.
 *
 * @param {MessagePayload} payload - Object containing the notification information.
 * @param {object} payload.notification - Object containing the notification details.
 * @param {string} payload.notification.title - Title of the notification.
 * @param {string} payload.notification.body - Body of the notification.
 */
export function notificationFirebase(payload: MessagePayload): void {
    const title = payload.notification!.title!;
    const notificationOptions: any = {
        body: payload.notification!.body,
        icon: payload.notification!.icon,
    };

    const notification = {
        id: notificationOptions.id || Vue.prototype.$uid(),
        message: `<b>${title}</b> ${notificationOptions.body}`,
        icon: notificationOptions.icon || 'fas fa-bell',
        createdAt: notificationOptions.createdAt || moment(),
        isRead: notificationOptions.isRead || false,
        link: notificationOptions.link || false,
        isImportant: (notificationOptions.options && notificationOptions.options.isImportant)
            ? notificationOptions.options.isImportant : false,
    };

    store.notification = notification;

    if ('Notification' in window) {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                const options = {
                    body: notificationOptions.body,
                    icon: store.icon,
                };
                navigator.serviceWorker.ready.then(registration => {
                    if (registration) {
                        registration.showNotification(title, options);
                    }
                });
            }
        });
    }
}

/**
 * Function that handles background messages and displays the notification.
 *
 * @param {object} event - Event containing the data of the received background message.
 */
export function onBackgroundMessage(event: any): void {
    const payload = event.data;
    notificationFirebase(payload);
}

/**
 * Detects the user's device type based on the user agent.
 *
 * @returns {string} - Detected device type: "iPhone", "Android", "Mac", "Windows", or "Unknown".
 */
export function detectDevice(): string {
    const userAgent = navigator.userAgent.toLowerCase();

    if (/iphone|ipad|ipod/.test(userAgent)) {
        return "iPhone";
    } else if (/android/.test(userAgent)) {
        return "Android";
    } else if (/macintosh|mac os x/.test(userAgent)) {
        return "Mac";
    } else if (/windows/.test(userAgent)) {
        return "Windows";
    } else {
        return "Unknown";
    }
}

/**
 * Computed property that returns a boolean value indicating if push notifications are enabled.
 *
 * @returns {ComputedRef<boolean | Promise<boolean>>} - `true` if push notifications are enabled; `false` otherwise.
 */
export const checkPushNotifications: ComputedRef<boolean | Promise<boolean>> = computed(() => {
    // Check if the browser supports notifications
    if ("Notification" in window) {
        // Check if notifications are allowed
        if (Notification.permission === "granted") {
            return true; // Push notifications are active
        } else if (Notification.permission === "denied") {
            return false; // Push notifications are blocked
        } else {
            // Notifications are neither granted nor blocked, so we will request permission from the user.
            return Notification.requestPermission().then(function (permission) {
                return permission === "granted"; // Return true if user grants permission, false otherwise
            });
        }
    } else {
        return false; // The browser does not support push notifications
    }
});
