
import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-copy-task',
  templateUrl: './copy-task.component.html',
  styleUrls: ['./copy-task.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyTaskComponent implements OnInit {

  lists: any[];
  form: FormGroup;

  constructor(

    //  the data is inject from task-home component ts
    // this is the fixed usage for dialog 
    @Inject(MD_DIALOG_DATA) private data,
    private fb: FormBuilder,
    private dialogRef: MdDialogRef<CopyTaskComponent> ) { }

  ngOnInit() {
    this.lists = this.data.lists;
    this.form = this.fb.group({
      targetListId: []
    })
  }

  onSubmit(ev: Event, {value, valid}) {
    ev.preventDefault();
    if (!valid) {
      return;
    }
    this.dialogRef.close(value.targetListId);
  }

}
