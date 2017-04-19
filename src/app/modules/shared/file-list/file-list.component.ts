import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
    selector: 'ewo-file-list',
    templateUrl: './file-list.component.html',
    styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {

    @Input()
    fileList:any[] = [];
    
    constructor() { }

    ngOnInit() {
        
    }

}
