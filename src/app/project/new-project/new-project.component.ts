

import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewProjectComponent implements OnInit {

  title = '';
  coverImages = [];
  newProjectForm: FormGroup;

  //  get the data from outside by inject method
  constructor(@Inject(MD_DIALOG_DATA) private data, 

              // if want to transite the data outside, it need MddialogRef, and let outside component receive it.
              private dialogRef: MdDialogRef<NewProjectComponent>,
              private fb: FormBuilder
            ) { }

  ngOnInit() {

    // this 'data' from project-list ts
    this.coverImages = this.data.thumbnails;

    // becaue this dialog form used for both project create and project update,
    // for the update project
    if (this.data.project) {
      this.newProjectForm = this.fb.group({
        name: [this.data.project.name, Validators.required],
        desc: [this.data.project.desc],
        coverImg: [this.data.project.coverImg]
      });
      this.title= 'Update Project';

      // for the new project
    } else {
      this.newProjectForm = this.fb.group({

        // to match with formControlName
        name: ['', Validators.required],
        desc: [''],
        coverImg: [this.data.img]
      });
      this.title= 'New Project';
    }

    // this.title = this.data.title;
    // console.log(JSON.stringify(this.data));
  }

  onSubmit({value, valid}, ev: Event) {
    
    ev.preventDefault();
    
    if (!valid) {
      return;
    }
    this.dialogRef.close({name: value.name, desc: value.desc ? value.desc : null, coverImg: value.coverImg});
  }

}
