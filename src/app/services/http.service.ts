import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { ConnectionBackend, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import config from '../config';
//import { HttpTemp } from '../utils/http';
import {
  Storage,
  NotificationService,
} from './index';

/* TODO
  - loading state or something (for spinner, etc)
*/

@Injectable()
export class AppHttp extends Http {

  constructor(
    protected _backend: ConnectionBackend,
    protected _defaultOptions: RequestOptions,
    private storage: Storage,
    private notifications: NotificationService
  ) {
    super(_backend, _defaultOptions);
    //_defaultOptions.withCredentials = true;
  }

  private _headers(options?: RequestOptionsArgs) {
    options = options || {};
    options['headers'] = options.headers || new Headers();

    // set content type
    options.headers.append('Content-Type', config.api.contentType);

    // set token
    options.headers.append(config.api.tokenLabel, this.getToken());
    // options.headers.append(config.api.tokenLabel, 'Jwt ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6ImFkbWluQGVhc3l3b3Jrb3JkZXIuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImV4cCI6MTQ4ODQwMTk2M30.h7MF3nFL6kB4TZ0g-iQ2y7Mmw_Adufn1IgblgHwyKVY');

    return options;
  }

  // wrap and serialize request
  private _serialize(value: any): string {
    //value = HttpTemp.serialize(value); // TEMP TEMP TEMP
    return JSON.stringify(value);
  }

  // unwrap and deserialize response
  private _deserialize(res: Observable<Response>): any {
    return res
      .map(res => {
        let data = res.json() || {}; // RESERVED / let data = HttpTemp.deserialize(res.json() || {}); // TEMP TEMP TEMP
        return (data);
      })
      .catch(res => {

        // server errors
        /* RESERVED
        if (res.status >= 500 && res.status < 600) {
          let data = res.text() || 'Server error (${res.status})';
          console.error(data);
          return Observable.throw(data);
        }
        */

        // server errors // TEMP TEMP TEMP / remove later
        if (res.status >= 500 && res.status < 600) {
          let data: any;

          try {
            data = res.json() || {};
          } catch (e) {
            data = this._error(res.text(), res.status);
          }

          // this.notifications.create(data.error.message, config.notification.level.values.DANGER);
          // this.notifications.create(data.detail, config.notification.level.values.DANGER);
          return Observable.throw(res.text());
        }

        // client errors
        if (res.status >= 400 && res.status < 500) {
          let data = res.json() || {};
          // this.notifications.create(data.error.message, config.notification.level.values.DANGER);
          // this.notifications.create(data.detail, config.notification.level.values.DANGER);
          return Observable.throw(res.text()); // TODO: could be replaced
        }

        return Observable.throw(res.text()); // TEMP TEMP TEMP / try to no throw exception, just return the response
      });
  }

  // encode search (url) params
  private _encode(params?: any): URLSearchParams {
    if (params instanceof URLSearchParams) return params;

    let searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => params[key] !== null && searchParams.set(key, params[key]));

    return searchParams;
  }

  // exprimental
  // create fake error response
  private _error(message: string, status: number = 400): any {
    return {
      error: {
        code: status,
        message: message || 'Server error (${status})',
      }
    };
  }

  public getToken() {
    const token = this.storage.get(config.storage.token);
    // return token ? config.api.tokenValue(token.access_token) : null;
    return token ? config.api.tokenValue(token.token) : null;
  }

  get(url: string, params?: any, options?: RequestOptionsArgs): Observable<any> {
    options = this._headers(options);
    params && (options.search = this._encode(params));

    let res = super.get(config.api.base + url, options);
    return this._deserialize(res).share(); // share: to make cosecutive observers calls
  }

  getByFullUrl(url: string, params?: any, options?: RequestOptionsArgs): Observable<any> {
    options = this._headers(options);
    params && (options.search = this._encode(params));

    let res = super.get(url, options);
    return this._deserialize(res).share(); // share: to make cosecutive observers calls
  }

  post(url: string, body?: any, params?: any, options?: RequestOptionsArgs): Observable<any> {
    options = this._headers(options);
    body = this._serialize(body);
    params && (options.search = this._encode(params));

    let res = super.post(config.api.base + url, body, options);
    return this._deserialize(res).share(); // share: to make cosecutive observers calls
  }

  put(url: string, body: any, params?: any, options?: RequestOptionsArgs): Observable<any> {
    options = this._headers(options);
    body = this._serialize(body);
    params && (options.search = this._encode(params));

    // let res = super.put(config.api.base + url, body, options);
    let res = super.put(url, body, options);
    return this._deserialize(res).share(); // share: to make cosecutive observers calls
  }

  patch(url: string, body: any, params?: any, options?: RequestOptionsArgs): Observable<any> {
    options = this._headers(options);
    body = this._serialize(body);
    params && (options.search = this._encode(params));

    // let res = super.patch(config.api.base + url, body, options);
    let res = super.patch(url, body, options);
    return this._deserialize(res).share(); // share: to make cosecutive observers calls
  }

  delete(url: string, params?: any, options?: RequestOptionsArgs): Observable<any> {
    options = this._headers(options);
    params && (options.search = this._encode(params));

    // let res = super.delete(config.api.base + url, options);
    let res = super.delete(url, options);
    return this._deserialize(res).share(); // share: to make cosecutive observers calls
  }

  upload(url: string, file: File, params: any = {}, options: any = {}): Observable<any> {

    // use different upload approaches for mock and non-mock backends
    if (this._backend['_browserXHR']) {
      let observable = Observable.create(observer => {

        let fileReader = new FileReader();

        let fileReaderPromise = new Promise<any>((resolve, reject) => {

          fileReader.onprogress = event => { /* pass */ };

          fileReader.onerror = event => {
            // TODO: refactor
            // gettin' warning: "Property 'error' does not exist on type 'EventTarget'"

            //switch (event.target.error.code) {
            //  case event.target.error.NOT_FOUND_ERR:
            //    reject('File not found');
            //    break;
            //  case event.target.error.NOT_READABLE_ERR:
            //    reject('File not readable');
            //    break;
            //  case event.target.error.ABORT_ERR:
            //    reject('File upload aborted');
            //    break;
            //  default:
            //    reject('File error');
            //}
          };

          fileReader.onload = event => {
            // TODO: here we need to implement some compression process

            resolve(new File(
              // TODO: refactor. getting "Property 'result' does not exist on type 'EventTarget'"
              [new Blob([(<any> event.target).result], {type: 'text/csv'})],
              file.name,
              {type: 'text/csv'}
            ));
          };

          // TEMP TEMP TEMP
          // TODO: to read and compress file later (and make it compatible with over 250Mb files, processing files by chunks)
          //fileReader.readAsBinaryString(file);
          resolve(file);
        });

        fileReaderPromise.then((file: File) => {
          // TODO: TEMP - there is an issue with angular2 http service and uploading file, we implemented temp solution
          // so, we use raw 'XMLHttpRequest' and 'multipart/form-data' for real backend
          // and we use http service, parsing file and JSON serialization with mock backend
          let formData = new FormData();
          formData.append('file', file, file.name);

          let request = this._backend['_browserXHR'].build(); // new XMLHttpRequest();
          options.onloadstart && request.addEventListener('loadstart', options.onloadstart);
          options.onprogress && request.addEventListener('progress', options.onprogress);
          options.onabort && request.addEventListener('abort', options.onabort);
          options.onerror && request.addEventListener('onerror', options.onerror);
          options.onload && request.addEventListener('load', options.onload);
          options.ontimeout && request.addEventListener('timeout', options.ontimeout);
          options.onloadend && request.addEventListener('loadend', options.onloadend);

          // Experimental
          options.onprogress && request.upload.addEventListener('progress', options.onprogress);

          // deserialize/format response
          request.addEventListener('loadend', (event: any) => { // Typescript doesn't serve event object properly

            if (event.target.status >= 500 && event.target.status < 600) {
              // format error response and sent it up
              let data = this._error(event.target.response, event.target.status);
              return observer.error(data);
            }

            if (event.target.status >= 400 && event.target.status < 500) {
              // format error response and sent it up
              let data = JSON.parse(event.target.response) || {};
              return observer.error(data);
            }

            let data = JSON.parse(event.target.response) || {};
            observer.next(data);
            observer.complete();
          });

          request.open('POST', config.api.base + url + '?' + this._encode(params), true);
          request.setRequestHeader(config.api.tokenLabel, this.getToken());
          request.send(formData);

        }).catch(err => {
          // create error response and sent it up
          observer.error(this._error(err));
        });
      });

      return observable.share();

    } else {
      let observable = Observable.create(observer => {

        let fileReader = new FileReader();

        fileReader.onload = e => {
          let body = e.target['result'];
          options = this._headers(options);
          options.headers.set('Content-Type', 'text/plain; charset=utf-8');
          params && (options.search = this._encode(params));

          let res = super.post(config.api.base + url, body, options);

          this._deserialize(res).subscribe(data => {
            observer.next(data);
            observer.complete();
          });
        };

        fileReader.readAsText(file);
      });

      return observable.share();
    }
  }

}
