import { Observable } from 'rxjs/Observable';

import { TObjectId } from './common.interface';

export type TNotificationId = TObjectId;

export interface INotification {
  id: TNotificationId;
  type: string; // see config.notification.type
  created: number; // timestamp
  options?: INotificationOptions; // reserved
  actions?: INotificationActions; // reserved
  data: INotificationData | Observable<any>; // aka payload
}

export interface INotificationOptions {
  dismissOnTimeout: boolean;
  timeout: number; // milliseconds
  dismissButton: boolean;
  dismissOnClick: boolean;
  onDismiss: any; // function;
  //combineDuplications: boolean;
  //...
}

export interface INotificationActions {
  // reserved
}

export interface INotificationData {
  level?: string; // reserved / see config.notification.level
  text?: string;
  html?: string;
  // ...props / extra options
}
