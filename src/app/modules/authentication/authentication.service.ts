import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import config from './../../config';
import { NotificationService } from './../../services/notification.service';
// import * as jQuery from 'jquery';

import {
  AppHttp,
  Storage,
  EventService,
} from './../../services/index';
import { Subject } from "rxjs/Subject";

@Injectable()
export class AuthenticationService {

  redirectUrl: string;
  private _authenticated: boolean = null; // should be 'null' before the first authentication request
  private _userDataGuest = { username: 'guest', name: 'Guest' };
  private _data: any = {
    view: null,
    edit: null,
  };
  private tokenValidSource = new Subject<boolean>();
  tokenValid$ = this.tokenValidSource.asObservable();
  isValidToken: boolean = false;
  data = this._data;

  constructor(
    private router: Router,
    private http: AppHttp,
    private storage: Storage,
    private notifications: NotificationService,
    protected events: EventService,
    private toasterService: ToasterService
  ) {
    // init observer
    let observable = new ReplaySubject(1); // buffer last value
    this._data['observable'] = observable;

    // init token expiration
    Observable.interval(10 * 60 * 1000).subscribe(() => { // 10 minutes
      const token = this.storage.get(config.storage.token);
      token && token.expires < Date.now() / 1000 && this.signout();
    });
  }

  token(): string {
    // fetch token from storage
    const token = this.storage.get(config.storage.token);
    return token ? token.token : null;
  }

  isAuthenticated(): boolean {
    // true, false or null (if authentication is not compeleted yet)
    return this._authenticated;
  }

  /* RESERVED
  hasPermission(permissions) {
    // permissions: example - ['admin', 'superuser'] or 'admin'
    if (!permissions || permissions && !permissions.length) return true;

    var permissions = Array.isArray(permissions) ? permissions : [permissions];
    var groups = this._data.view && Array.isArray(this._data.view.groups) ? this._data.view.groups : [];

    // transform aliases to keys
    var configGroups = config.user.groups.values
    permissions = permissions.map(function(permission) {
        return config.user.groups.values[permission] ? permission : config.user.groups.aliases[permission];
      });

    var permissionsInGroups = permissions.filter(function(permission) {
        return groups.indexOf(permission) > -1;
      });

    return !!permissionsInGroups.length;
  }
  */

  authenticate(validate: boolean = true): Observable<any> {
    const user = this.storage.get(config.storage.user);
    const token = this.storage.get(config.storage.token);

    const observable = new ReplaySubject(1);

    if (token && new Date(token.expires).getTime() > Date.now()) {
      if (validate) {
        // GET '/me'
        this.http.get('api-token-auth/').subscribe(
          data => observable.next(data),
          err => observable.error(err),
          () => observable.complete()
        );

      } else {
        if (user) {
          observable.next(user);
          observable.complete();

        } else {
          // non-authenticated
          observable.error('Invalid user'); // should it be wrapped?
        }
      }

    } else {
      // non-authenticated
      this.storage.clear();
      observable.error('Non authenticated'); // should it be wrapped?
    }

    observable.subscribe(
      user => {
        this.storage.set(config.storage.user, user);
        // OBSOLETED //this.storage.set(config.storage.token, user.token);
        this._data.view = user;
        this._authenticated = true;
        this._data.observable.next(user); // experimental
        this.events.emit('USER_AUTHORIZED', user);
      },
      () => {
        this.storage.remove(config.storage.user);
        // OBSOLETED //this.storage.remove(config.storage.token);

        this._data.view = null;
        this._authenticated = false;

        this._data.observable.next(user); // experimental
      }
    );

    return observable;
  }

  deauthenticate(): void {
    this._data.view = null; // this._userDataGuest;
    this._authenticated = false;

    this._data.observable.next(this._data.view);
    this.events.emit('USER_DEAUTHORIZED');
  }

  edit(user?: any): any {
    user = user || this._data.view || {};
    user = Object.assign(true, {}, user); // TODO: replace with native function later
    delete user.password;

    this._data.edit = user;
  }

  signup(credentials: any): Observable<any> {
    // POST '/signup'
    const observable = this.http.post('signup', credentials);

    // TODO: could be changed, if we don't return token immediately
    observable.subscribe(
      data => {
        const user = <any>data;
        //const token = user.token;

        this.storage.set(config.storage.user, user);
        //this.storage.set(config.storage.token, token);

        this.authenticate(false); // let's authenticate to let "password reset" work
      }
    );

    return observable;
  }

  signin(credentials: any): Observable<any> {
    // POST '/signin'
    const observable = this.http.post('api-token-auth/', credentials);

    observable.subscribe(
      data => {
        const token = <any>data;

        // OBSOLETED / this.storage.set(config.storage.user, user);
        this.storage.set(config.storage.token, token);
        // this.toasterService.pop('success', 'Args Title', 'Args Body');
        this.events.emit('USER_SIGNIN'); // use authentication event instead
      },
      error => {
        this.toasterService.pop('info', 'Login Failed!', 'Sorry you have entered invalid credential!!!');

        console.log('Login failed: ', error);
      }
    );

    return observable;
  }

  signout(): void {
    this.deauthenticate();
    this.storage.remove(config.storage.user);
    this.storage.remove(config.storage.token);
    //this.storage.remove(config.storage.preferences);

    this.events.emit('USER_SIGNOUT');
    this.router.navigate([config.routes.signoutRedirect]);
  }

  getUserInfo(): any {
    const observable = this.http.get('userinfo/');
    observable.subscribe(
      data => {
        let userInfo = <any>data;
        userInfo = Object.assign({}, userInfo, { IsContact: false, IsPropertyManager: false, IsEmployee: false, IsVendor: false });
        if (userInfo.group_name == config.userGroup.CONTACT)
          userInfo.IsContact = true;
        else if(userInfo.group_name == config.userGroup.PROPERTY_MANAGER)
          userInfo.IsPropertyManager = true;
        else if(userInfo.group_name == config.userGroup.EMPLOYEE)
          userInfo.IsEmployee = true;
        else if(userInfo.group_name == config.userGroup.VENDOR)
          userInfo.IsVendor = true;

        this.storage.set(config.storage.user, userInfo);
      },
      error => {
        this.toasterService.pop('Info', 'Failed to get additional user information!', 'Sorry! something went wrong, try to login again!!!');
        console.log('Unable to get User Info: ', error);
      }
    );
    return observable;
  }


  update(user?: any): Observable<any> {
    user = user || this._data.edit;

    let data = Object.assign(true, {}, user); // TODO: replace with native function later
    !data.password && (delete data.password);

    // POST 'api/me'
    const observable = this.http.post('me', data);

    observable.subscribe(
      data => {
        this._data.view = data || {};
        this.storage.set(config.storage.user, this._data.view);
      }
    );

    return observable;
  }

  password(credentials: any): Observable<any> {
    // POST 'api/me/password'
    const observable = this.http.post('me/password', credentials);

    observable.subscribe(
      () => {
        this.notifications.create('Your password has been updated successfully.');
      }
    );

    return observable;
  }

  passwordReset(data: any): Observable<any> {
    // POST 'api/me/password/reset'
    const observable = this.http.post('me/password/reset', data);

    observable.subscribe(
      () => {
        this.notifications.create('Please, check your email for details');
      }
    );

    return observable;
  }

  passwordResetConfirmation(data: any): Observable<any> {
    // POST 'api/me/password/resetcomplete'
    // TODO: ask to rename to ..../password/reset/confirmation
    const observable = this.http.post('me/password/resetcomplete', data);

    observable.subscribe(
      () => {
        this.notifications.create('Your password has been updated successfully. Please Log in with your new credentials. Redirecting to login page...');
      }
    );

    return observable;
  }

  setPreferences(key, value): void {
    let preferences = this.storage.get(config.storage.preferences) || {};
    preferences[key] = value;

    this.storage.set(config.storage.preferences, preferences);
  }

  getPreferences(key): any {
    let preferences = this.storage.get(config.storage.preferences) || {};
    return preferences[key];
  }

  verifyToken() {
    const token = this.storage.get(config.storage.token);
    const observable = this.http.post('api-token-verify/', token)

    observable.subscribe(data => {
      this.isValidToken = true;
      this.tokenValidSource.next(true);
    },
      error => {
        // this.toasterService.pop('info', 'Token Expired!', 'Sorry your token has expired!!!');
        this.router.navigate([config.routes.signin]);
      });
    return observable;
  }
}
