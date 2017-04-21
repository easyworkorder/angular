import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { BreadcrumbService } from './breadcrumb.service';
import 'rxjs/add/operator/pairwise';
/**
 * This component shows a breadcrumb trail for available routes the router can navigate to.
 * It subscribes to the router in order to update the breadcrumb trail as you navigate to a component.
 */
@Component({
    selector: 'ewo-breadcrumb',
    template: `
        <!--<ul [class.breadcrumb]="useBootstrap">-->
        <ul class="breadcrumb breadcrumb-top">
            <li *ngFor="let url of _urls; let last = last" [ngClass]="{'breadcrumb-item': useBootstrap, 'active': last}"> <!-- disable link of last item -->
                <a role="button" *ngIf="!last && url == prefix" (click)="navigateTo('/')">{{url}}</a>
                <a role="button" *ngIf="!last && url != prefix" (click)="navigateTo(url)">{{friendlyName(url)}}</a>
                <span *ngIf="last">{{friendlyName(url)}}</span>
                <span *ngIf="last && url == prefix">{{friendlyName('/')}}</span>
            </li>
        </ul>
    `
})
export class BreadcrumbComponent implements OnInit, OnChanges {
    @Input() useBootstrap: boolean = true;
    @Input() prefix: string = '';

    public _urls: string[];
    public _routerSubscription: any;

    constructor(
        private router: Router,
        private breadcrumbService: BreadcrumbService
    ) { }

    ngOnInit (): void {
        this._urls = new Array();

        if (this.prefix.length > 0) {
            this._urls.unshift(this.prefix);
        }

        this._routerSubscription = this.router.events.subscribe((navigationEnd: NavigationEnd) => {
            if (navigationEnd.id == 1) {
                this._urls.length = 0; //Fastest way to clear out array
            }
            // this._urls.length = 0; //Fastest way to clear out array
            navigationEnd.id == 1 && this.generateBreadcrumbTrail(navigationEnd.urlAfterRedirects ? navigationEnd.urlAfterRedirects : navigationEnd.url);
        });

        this.router.events
            .filter(e => e instanceof NavigationEnd)
            .pairwise().subscribe((data: any) => {


                let concaturl = data.reduce((acc, item) => acc.concat(item.url), []);
                let constring = concaturl[0].concat(concaturl[1]);

                if (concaturl[0].toString().match(/^\/ticket-details\/[0-9]{1,10}$/) &&
                    concaturl[1].toString().match(/^\/ticket-details\/[0-9]{1,10}$/)
                ) {
                    return;
                }
                this._urls.length = 0; //Fastest way to clear out array

                let isFromAdmin = false;
                if ((concaturl[0].toString().match(/^\/admin\/building\/[0-9]{1,10}\/tenant-profile\/[0-9]{1,10}$/) &&
                    concaturl[1].toString().match(/^\/ticket-details\/[0-9]{1,10}$/)) ||
                    (concaturl[0].toString().match(/^\/admin\/vendor\/[0-9]{1,10}$/) &&
                        concaturl[1].toString().match(/^\/ticket-details\/[0-9]{1,10}$/)) ||
                    (concaturl[0].toString().match(/^\/tenant\/[0-9]{1,10}$/) &&
                        concaturl[1].toString().match(/^\/ticket-details\/[0-9]{1,10}$/)) ||
                    (concaturl[0].toString().match(/^\/vendor\/[0-9]{1,10}$/) &&
                        concaturl[1].toString().match(/^\/ticket-details\/[0-9]{1,10}$/))
                ) {
                    isFromAdmin = true;
                }

                isFromAdmin && this.generateBreadcrumbTrail(constring);
                !isFromAdmin && this.generateBreadcrumbTrail(data[1].urlAfterRedirects ? data[1].urlAfterRedirects : data[1].url);
            })
    }

    ngOnChanges (changes: any): void {
        if (!this._urls) {
            return;
        }

        this._urls.length = 0;
        this.generateBreadcrumbTrail(this.router.url);
    }

    generateBreadcrumbTrail (url: string): void {
        if (!this.breadcrumbService.isRouteHidden(url)) {
            //Add url to beginning of array (since the url is being recursively broken down from full url to its parent)
            this._urls.unshift(url);
        }

        if (url.lastIndexOf('/') > 0) {
            this.generateBreadcrumbTrail(url.substr(0, url.lastIndexOf('/'))); //Find last '/' and add everything before it as a parent route
        } else if (this.prefix.length > 0) {
            this._urls.unshift(this.prefix);
        }
    }

    navigateTo (url: string): void {
        this.router.navigateByUrl(url);
    }

    friendlyName (url: string): string {
        return !url ? '' : this.breadcrumbService.getFriendlyNameForRoute(url);
    }

    ngOnDestroy (): void {
        this._routerSubscription.unsubscribe();
    }

}
