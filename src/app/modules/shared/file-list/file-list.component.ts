import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
    selector: 'ewo-file-list',
    templateUrl: './file-list.component.html'
})
export class FileListComponent implements OnInit {

    @Input()
    fileList:any[] = [];
    
    constructor() { }

    ngOnInit() {
        
    }

}
