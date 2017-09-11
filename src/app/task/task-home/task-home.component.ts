
import { Component, OnInit, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import {MdDialog} from '@angular/material';
import {NewTaskComponent} from '../new-task/new-task.component';
import {CopyTaskComponent} from '../copy-task/copy-task.component';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';
import {NewTaskListComponent} from '../new-task-list/new-task-list.component';
import {routerAnimation} from '../../animation/router.animation';
import {ActivatedRoute} from '@angular/router';

import {Store} from '@ngrx/store';
import * as fromRoot from '../../reducers';
import {Observable} from 'rxjs/Observable';
import * as actions from '../../actions/task-list.action';
import * as taskActions from '../../actions/task.action';
import {TaskList} from '../../domain';

@Component({
  selector: 'app-task-home',
  templateUrl: './task-home.component.html',
  styleUrls: ['./task-home.component.scss'],
  animations: [
    routerAnimation
  ],

  changeDetection: ChangeDetectionStrategy.OnPush
})


export class TaskHomeComponent implements OnInit {

 /* lists = [
    {
      id: 1,
      name: 'READY',
      order: 1,
      tasks: [
        {
          id: 1,
          desc: 'ready one',
          completed: true,
          priority: 3,
          owner: {
            id: 1,
            name: 'rick',
            avatar: 'avatars:svg-11'
          },
          dueDate: new Date(),
          remind: new Date()
        },
        {
          id: 2,
          desc: 'ready two',
          completed: false,
          priority: 2,
          owner: {
            id: 1,
            name: 'huang',
            avatar: 'avatars:svg-12'
          },
          dueDate: new Date()
        }
        
      ]
    },
    {
      id: 2,
      name: 'IN PROCESS',
      order: 2,
      tasks: [
        {
          id: 1,
          desc: 'process one',
          completed: false,
          priority: 3,
          owner: {
            id: 1,
            name: 'rick',
            avatar: 'avatars:svg-13'
          },
          dueDate: new Date()
        },
        {
          id: 2,
          desc: 'process two',
          completed: true,
          priority: 1,
          owner: {
            id: 1,
            name: 'huang',
            avatar: 'avatars:svg-14'
          },
          dueDate: new Date(),
          remind: new Date()
        }
        
      ]
    }
  ] */



  // binding the router animation with the whole component.
  @HostBinding('@routerAnim') state;

  projectId$: Observable<string>;
  lists$: Observable<TaskList[]>;

  // dialog used to open the dialog component
  constructor(
    private dialog: MdDialog, 
    private store$: Store<fromRoot.State>,
    private route: ActivatedRoute
    ) { 
      // get the route parameters Observable type
      //  match { path: 'tasklists/:id', component: TaskHomeComponent }
      this.projectId$ = this.route.paramMap.pluck('id');
      this.lists$ = this.store$.select(fromRoot.getTasksByLists);
    }

  ngOnInit() {
  }

  OpenNewTaskDialog(list) {

    const user$ = this.store$.select(fromRoot.getAuthState).map(auth => auth.user);
    user$.take(1)
      .map(user => this.dialog.open(NewTaskComponent, {data: {title: 'New Task', owner: user}}))
      .switchMap(dialogRef => dialogRef.afterClosed().take(1).filter(n => n))
      .subscribe(val => this.store$.dispatch(new taskActions.AddAction({...val, taskListId: list.id, completed: false, createDate: new Date()})))
  }

  OpenCopyTaskDialog(list) {
    // this click event is transmit from the task-header, and will send the data to CopyTaskComponent.
    // const dialogRef =  this.dialog.open(CopyTaskComponent, {data: {lists: this.lists}});
    this.lists$.map(l => l.filter(n => n.id !== list.id))
      .map(li => this.dialog.open(CopyTaskComponent, {data: {lists: li}}))
      .switchMap(dialogRef => dialogRef.afterClosed().take(1).filter( n => n))
      .subscribe(val => this.store$.dispatch(new taskActions.MoveAllAction({srcListId: list.id, targetListId: val})))
    
  }

  OpenUpdateTaskDialog(task) {
    const dialogRef = this.dialog.open(NewTaskComponent, {data: {title: 'Modify Task', task: task}});
    dialogRef.afterClosed()
      .take(1)
      .filter(n => n)
      .subscribe(val => this.store$.dispatch(new taskActions.UpdateAction({...task, ...val})));
  }

  OpenConfirmDialog(list: TaskList) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: {title: "Delete List", content: "Are you sure to delete the list?"}});
    dialogRef.afterClosed()
      .take(1)
      .filter(n => n) // only deal with it when the dialog return true
      .subscribe(result => this.store$.dispatch(new actions.DeleteAction(list)));
  }

  OpenEditListDialog(list: TaskList) {
    const dialogRef = this.dialog.open(NewTaskListComponent, {data: {title: 'Modify List Name', taskList: list}});
    dialogRef.afterClosed()
      .take(1) 
      .filter(n => n) 
      // here result is the value after edit, and need to add id property on this value
      .subscribe(result => this.store$.dispatch(new actions.UpdateAction({...result, id: list.id})));
  }

  OpenNewListDialog(ev: Event) {
    // will transfer the data.
    const dialogRef = this.dialog.open(NewTaskListComponent, {data: {title: 'New Task List'}});
    dialogRef.afterClosed()
      .take(1)
      .filter(n => n)
      .subscribe(result => this.store$.dispatch(new actions.AddAction(result)));
  }

  handleMove(srcData, list) {
    switch (srcData.tag) {
      case 'task-item': 
        console.log('handling item');
        break;
      case 'task-list':
        console.log('handle list');
        const srcList = srcData.data;
        const tempOrder = srcList.order;
        srcList.order = list.order;
        list.order = tempOrder;
        break;
      default:
        break;
    }
  }

  handleQuickTask(desc: string, list) {
    
    const user$ = this.store$.select(fromRoot.getAuthState).map(auth => auth.user);
    user$.take(1)
      .subscribe(user => this.store$.dispatch(new taskActions.AddAction({
        desc: desc,
        priority: 3,
        ownerId: user.id,
        participantIds: [],
        taskListId: list.id,
        completed: false,
        createDate: new Date()
        })))
  }

}
