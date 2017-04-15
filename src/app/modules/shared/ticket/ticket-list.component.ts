import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { DataService, AppHttp } from "app/services";
import { Router } from "@angular/router";

@Component({
    selector: 'ewo-ticket-list',
    templateUrl: './ticket-list.component.html'
})
export class TicketListComponent implements OnInit {

    constructor(
        // private http: ApdpHttp,
        private dataService: DataService,
        private router: Router
    ) { }
    /// A List of Contact objects to display
    @Input() tickets: any[];
    @Input() isAdmin: boolean = false;
    @Output('update') change: EventEmitter<any> = new EventEmitter<any>();

    ngOnInit () {
        console.log('tickets', this.tickets);

        let ticketList = Object.assign({}, this.tickets, { checked: false });
    }
    ngAfterViewInit () {
        console.log('tickets', this.tickets);

        let ticketList = Object.assign({}, this.tickets, { checked: false });
    }


    stopPropagation (event) {
        event.stopPropagation();
    }

    updateTicket (data) {
        this.change.emit(data);
    }

    getTicketDetails (ticket) {
        this.router.navigate(['/ticket-details', ticket.id]);
    }

    getPhotoUrl (ticket) {
        if (ticket.photo != null && ticket.photo.length > 0) {
            return ticket.photo;
        }
        return 'assets/img/placeholders/avatars/avatar12.jpg';
    }
}
