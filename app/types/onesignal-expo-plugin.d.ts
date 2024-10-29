declare module 'onesignal-expo-plugin' {
  export interface NotificationEventComplete {
    getNotification: () => OSNotification;
    complete: (notification: OSNotification) => void;
  }

  export interface OSNotification {
    notificationId: string;
    title?: string;
    body?: string;
    additionalData?: any;
    launchURL?: string;
  }

  export interface DeviceState {
    userId?: string | null;
    pushToken?: string | null;
    emailUserId?: string | null;
    emailAddress?: string | null;
    isSubscribed?: boolean;
  }

  export function initialize(appId: string): void;
  
  export function setNotificationWillShowInForegroundHandler(
    handler: (event: NotificationEventComplete) => void
  ): void;
  
  export function setNotificationOpenedHandler(
    handler: (openedEvent: { 
      notification: OSNotification;
      action: { type: string } 
    }) => void
  ): void;
  
  export function getDeviceState(): Promise<DeviceState>;
} 