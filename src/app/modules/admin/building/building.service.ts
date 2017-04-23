import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ToasterService } from 'angular2-toaster';

// import { NotificationService } from '../../services/notification.service';
import { Observable } from 'rxjs/Observable';

import { IBuilding } from '../../../interfaces/building.interface';


import {
  AppHttp,
  DataService,
  EventService,
  NotificationService
} from '../../../services';

@Injectable()
export class BuildingService extends DataService {
  private _editedBuilding: any;

  constructor(
    protected http: AppHttp,
    protected events: EventService,
    private notifications: NotificationService,
    private toasterService: ToasterService
  ) {
    super(events);
  }

  create (data?: any): Observable<IBuilding> {

    data = Object.assign({}, data);
    const observable = this.http.post('building/', data);

    observable.subscribe(data => {
      this.toasterService.pop('success', 'ADD', 'Building has been saved successfully');
    },
      error => {
        this.toasterService.pop('error', 'ADD', 'Building not Saved due to API error!!!');
      });

    return observable;
  }

  update (data?: any): Observable<IBuilding> {
    data = Object.assign({}, data);

    // PUT '/employee'
    // const observable = this.http.put(data.url, data);
    const observable = this.http.patch(data.url, data);

    observable.subscribe(data => {
      this.toasterService.pop('success', 'UPDATE', 'Building information has been updated successfully');
    },
      error => {
        this.toasterService.pop('error', 'UPDATE', 'Building information not updated due to API error!!!');
      });

    return observable;
  }

  getAllBuildings (company_id) {

    const observable = this.http.get('buildinglist/' + company_id + '/');
    observable.subscribe(data => {
    });
    return observable;
  }

  getBuilding (id) {
    const observable = this.http.get('building/' + id + '/');
    observable.subscribe(data => {
    });
    return observable;
  }

  getAllActiveBuildings (company_id) {
    const observable = this.http.get('building/', { company: company_id, active: true, ordering: 'name' });
    observable.subscribe(data => {
    });
    return observable;
  }

  get editedBuilding (): any {
    return this._editedBuilding;
  }

  set editedBuilding (val: any) {
    if (val != this._editedBuilding) {
      this._editedBuilding = val;
    }
  }

  getDocuments (building_id) {
    const observable = this.http.get('buildingdocument/?building_id=' + building_id + '&ordering=id');
    // observable.subscribe(data => {});
    return observable;
  }
}
