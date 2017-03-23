import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TNotificationId, INotification } from '../interfaces/notification.interface';

import config from '../config';

@Injectable()
export class NotificationService {
  private INTERVAL = 3000;
  protected _data: INotification[] = []; // Experimental / could be more complex

  public data = this._data;

  constructor() {
    // to refresh notifications
    window.setInterval(() => {
      this._refresh(this._data);
    }, config.notification.interval || this.INTERVAL);
  }

  find(id: TNotificationId): INotification {
    return (this._data || []).find(item => item.id == id);
  }

  create(item: {} | string, level?: string): INotification {
    let notification: INotification;

    // create notification object
    if (typeof item == 'string') {
      notification = <any> {
        data: {
          level: level || config.notification.level.values.INFO,
          text: item, // text
        },
      };

    } else {
      // notification = Object.assign(true, {}, item);
    }

    // set props
    notification.id = <TNotificationId> '_' + Math.random().toString(36).substr(2, 9);
    notification.type = notification.type || config.notification.type.values.DEFAULT;
    notification.data = notification.data || {};
    notification.created = Date.now();

    notification.options = <any> Object.assign({}, config.notification.defaults, notification.options);

    // set "observable" data props
    if (notification.data instanceof Observable) {
      let observable = <Observable<any>> notification.data;

      notification.data = {};
      observable.subscribe(this._subscribe(notification));
    }

    this._data.push(notification);

    return notification;
  }

  update(id: TNotificationId, data?: any): INotification {
    let notification = this.find(id);

    // pass // @todo: update notification
    return notification;
  }

  delete(id: TNotificationId): TNotificationId {
    let index = this.data.reduce((result, item, index) => {
      return item.id == id ? index : result;
    }, -1);

    index > -1 && this._data.splice(index, 1);

    return id;
  }

  trackBy(index: number, item): any {
    return item && item['id'];
  }

  private _subscribe(notification: INotification) {
    return (data: any) => {
      notification.data = data; // unpack observerable data
    };
  }

  private _refresh(notifications: INotification[] = []) {
    let now = Date.now();

    for (let i = notifications.length - 1; i >= 0; i--) {
      let item = notifications[i];
      let dismiss = (
        item.options.dismissOnTimeout
          ? item.options.timeout
          ? item.created + item.options.timeout < now : false : false
        // add more conditions here
      );

      dismiss && item.options.onDismiss && item.options.onDismiss(item);
      dismiss && this._data.splice(i, 1);
    }
  }
}
