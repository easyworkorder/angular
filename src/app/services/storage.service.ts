// TODO: supposed to be replaced with any stable angular/es6 storage lib
import { Injectable } from '@angular/core';
import config from '../config';

@Injectable()
export class Storage {

  // TODO: try to add caching

  get(key: string): any {
    const value = localStorage.getItem(key);

    try {
      return value == undefined ? undefined : JSON.parse(value);
    } catch (err) {
      return value; // err.name == 'SyntaxError' // err instanceof SyntaxError
    }
  }

  hasItem(key: string) {
      return localStorage.getItem(key) !== null;
  }

  set(key: string, value: any): void {
    if(this.hasItem(key))
      this.remove(key);
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  // private _userInfo: any;
  getUserInfo() {
    // if(!this._userInfo) {
    //   this._userInfo = this.get(config.storage.user)
    // }
    // return this._userInfo;
    return this.get(config.storage.user);
  }
}
