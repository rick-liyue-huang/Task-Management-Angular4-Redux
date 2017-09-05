
import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-copy-task',
  templateUrl: './copy-task.component.html',
  styleUrls: ['./copy-task.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyTaskComponent implements OnInit {

  lists: any[];

  constructor(

    //  the data is inject from task-home component ts
    // this is the fixed usage for dialog 
    @Inject(MD_DIALOG_DATA) private data,
    private dialogRef: MdDialogRef<CopyTaskComponent> ) { }

  ngOnInit() {
    this.lists = this.data.lists;
  }

  onClick() {
    
  }

}
