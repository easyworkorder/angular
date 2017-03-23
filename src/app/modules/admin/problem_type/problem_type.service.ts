import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ProblemType } from '../../../interfaces/problem_type.interface';
import { ToasterService } from 'angular2-toaster';
import config from '../../../config';

import {
  AppHttp,
  DataService,
  EventService,
  NotificationService
} from '../../../services';

@Injectable()
export class ProblemTypeService extends DataService {

  constructor(
    protected http: AppHttp,
    protected events: EventService,
    private notifications: NotificationService,
    private toaster: ToasterService
  ) {
    super(events);
  }

  create(data?: any): Observable<ProblemType> {
    data = Object.assign({}, data);
    // POST '/problem type'
    const observable = this.http.post('problemType/', data);

    observable.subscribe(data => {
      this.toaster.pop(config.messageType.SUCCESS, 'Problem Type', 'Saved Successfully');
      console.log(data);
    },
      error => {
        this.toaster.pop(config.messageType.ERROR, 'Problem Type', 'Not Saved!!!');
        console.log(error);
      });

    return observable;
  }

   update(data?: any): Observable<ProblemType> {
    data = Object.assign({}, data);
    // PUT '/problem type/id'
    // const observable = this.http.put('problemType/'+ data.id +'/', data);
    const observable = this.http.put(data.url, data);

    observable.subscribe(data => {
      this.toaster.pop(config.messageType.SUCCESS, 'Problem Type', 'Update Successfully');
      console.log(data);
    },
      error => {
        this.toaster.pop(config.messageType.ERROR, 'Problem Type', 'Not Update!!!');
        console.log(error);
      });

    return observable;
  }

  getProblemType(id) {
    const observable = this.http.get('problemType/' + id + '/');
    observable.subscribe(data => {
      //console.log(data);
    });
    return observable;
  }

  /**
   * Get All employee by Company Id
   * @returns {Observable<any>}
   */
  getAllProblemTypes(company_id) {
    const observable = this.http.get('problemType/', { company: company_id });
    observable.subscribe(data => {
      console.log(data);
    });
    return observable;
  }

    /**
     * This service is written for ticket component
     * @param company_id
     */
    getAllActiveProblemTypes(company_id) {
        const observable = this.http.get('problemType/', { company_id: company_id, active: true, ordering: 'problem_name'});
        observable.subscribe(data => {
            console.log(data);
        });
        return observable;
    }
}
