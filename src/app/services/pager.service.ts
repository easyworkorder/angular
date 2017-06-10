import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

export class PagerService {
    pager: any = {};

    items: Subject<any> = new BehaviorSubject([]);

    getPager (totalItems: number, currentPage: number = 1, pageSize: number = 15) {
        // calculate total pages
        let totalPages = Math.ceil(totalItems / pageSize);

        let startPage: number, endPage: number;
        if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage + 1 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {

                if ((totalPages - (currentPage - 2)) == 5) {
                    startPage = currentPage - 1;
                    endPage = currentPage + 3;
                } else {
                    startPage = currentPage - 2;
                    endPage = currentPage + 2;
                }
            }
        }

        // startPage = 1;
        // endPage = totalPages;

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        // let pages = _.range(startPage, endPage + 1);
        let pages = Array.from(Array(endPage), (_, i) => startPage + i);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

    getNextPrevPager (totalItems: number, currentPage: number = 1, pageSize: number = 4) {
        // calculate total pages
        let totalPages = Math.ceil(totalItems / pageSize);

        // added for if last page empty june 10-2017
        if (totalPages < currentPage) {
            currentPage = currentPage - 1;
        }

        let startPage: number, endPage: number;

        startPage = 1;
        endPage = totalPages;

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        // let pages = _.range(startPage, endPage + 1);
        let pages = Array.from(Array(endPage), (_, i) => startPage + i);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

    setPage (page: number, items: any[]) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        // get pager object from service
        this.pager = this.getNextPrevPager(items.length, page);

        // get current page of items
        let pagedItems = items.slice(this.pager.startIndex, this.pager.endIndex + 1);
        // return pagedItems;
        this.items.next(pagedItems);
    }
}