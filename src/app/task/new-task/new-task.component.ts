
import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewTaskComponent implements OnInit {

  title = '';

  priorities = [
    {
      label: 'emergency',
      value: 1
    },
    {
      label: 'important',
      value: 2
    },
    {
      label: 'normal',
      value: 3
    }
  ];

  form: FormGroup;
  
  constructor(
    @Inject(MD_DIALOG_DATA) private data, 
    private fb: FormBuilder,
    private dialogRef: MdDialogRef<NewTaskComponent>) { }

  ngOnInit() {
    this.title = this.data.title;
    // console.log(JSON.stringify(this.data.task));
    this.form = this.fb.group({
      desc: [this.data.task ? this.data.task.desc : '', Validators.required],
      owner: [this.data.task ? [this.data.task.owner] :[this.data.owner]],
      followers: [this.data.task ? [this.data.task.participants] : []],
      dueDate: [this.data.task ? this.data.task.dueDate : '', Validators.required],
      remind: [this.data.task ? this.data.task.reminder : ''],
      remark: [this.data.task ? this.data.task.remark : '', Validators.required],
    })
  }

  ngSubmit(ev: Event, {value, valid}) {
    ev.preventDefault();
    if (!valid) {
      return;
    }
    this.dialogRef.close({
      ...value,
      ownerId: value.owner.length > 0 ? value.owner[0].id : null,
      participantIds: value.followers.map(f => f.id)
    })
  }

}
