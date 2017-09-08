
import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms'

@Component({
  selector: 'app-new-task-list',
  templateUrl: './new-task-list.component.html',
  styleUrls: ['./new-task-list.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewTaskListComponent implements OnInit {
  newTaskListForm: FormGroup
  title = '';

  // this is the common use for dialog component, if need to import the data, using inject, if want to export the data, using dialogRef
  constructor(
    private fb: FormBuilder,
    @Inject(MD_DIALOG_DATA) private data, 
    private dialogRef: MdDialogRef<NewTaskListComponent>) { }

  ngOnInit() {
    this.title = this.data.title;

    this.newTaskListForm = this.fb.group({
      name: [this.data.taskList? this.data.taskList : "", Validators.required]
    });
  }

  onSubmit({value, valid}) {
    if (!valid) {
      return;
    }
    this.dialogRef.close(value);
  }

}
