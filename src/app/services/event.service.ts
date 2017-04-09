import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';

import { IEvent } from '../interfaces/event.interface';

@Injectable()
export class EventService {

  // TODO: naming?
  protected _observable: EventEmitter<any> = new EventEmitter(); // EventEmitter<IEvent>

  public observable = this._observable;

  constructor() {
  }

  subscribe(generatorOrNext?: any, error?: any, complete?: any): any {
    return this._observable.subscribe(generatorOrNext);
  }

  emit(type: string, data?: any): void {
    this._observable.emit(Object.assign({type: type}, {data: data}));
  }

  filter(predicate, thisArg?) { // specify typings
    return this._observable.filter(predicate, thisArg);
  }

  // feel free to add more helpers (aka observerable wrappers)
}
