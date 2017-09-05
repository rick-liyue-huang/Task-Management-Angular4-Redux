
import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {User} from '../../domain';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InviteComponent implements OnInit {

  /*
  items = [
    {
      id: 1,
      name: 'Rick'
    },
    {
      id: 2,
      name: 'Leo'
    },
    {
      id: 3,
      name: 'Huang'
    }
  ];  */

  members: User[] = [];
  constructor(@Inject(MD_DIALOG_DATA) private data: any, private dialogRef: MdDialogRef<InviteComponent>) { }

  ngOnInit() {
    this.members = [...this.data.members];
  }

  /*
  displayUser(user: {id: string; name: string}) {
    return user ? user.name : '';
  }

  */

  onSubmit(ev: Event, {value, valid}) {

    ev.preventDefault();
    if (!valid) {
      return;
    }

    this.dialogRef.close(this.members);
  }

}
