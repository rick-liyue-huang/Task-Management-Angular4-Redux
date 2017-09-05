

// this dialog can be used by other modules
import { Component, OnInit, Inject } from '@angular/core';
import {MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  template: `
  <h2 md-diaglog-title>{{title}}</h2>
  
  <div md-dialog-content>
    {{content}}
  </div>
  

  <div md-dialog-actions>
    <button type="button" md-raised-button color="primary" (click)="onClick(true)">Confirm</button>
    <button type="button" md-button md-dialog-close (click)="onClick(false)">Cancel</button>
  </div>

  `,
  styles: [``]
})
export class ConfirmDialogComponent implements OnInit {

  title = '';
  content = '';
  constructor(@Inject(MD_DIALOG_DATA) private data, private dialogRef: MdDialogRef<ConfirmDialogComponent>) { }

  ngOnInit() {
    this.title = this.data.title;
    this.content = this.data.content;
  }

  onClick(result: boolean) {
    this.dialogRef.close(result);
  }

}
