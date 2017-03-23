// TODO: supposed to be replaced with any stable angular/es6 storage lib
import { Injectable } from '@angular/core';

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

  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
