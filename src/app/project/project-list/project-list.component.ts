

/* 1. project.reducer.ts 
    2. project.effects.ts
    3. so in the ui component file, it only care what data I will emmit, 
    and which state I get from store


*/

// for the smart component, need ChangeDetectionStrategy, ChangeDetectorRef to do changedetection
import { Component, OnInit, HostBinding, HostListener, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';

import {MdDialog} from '@angular/material';
import {NewProjectComponent} from '../new-project/new-project.component';
import {InviteComponent} from '../invite/invite.component';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';

import {routerAnimation} from '../../animation/router.animation';
import {listAnimation} from '../../animation/list.animation';

import {Project} from '../../domain/project.model';
import {ProjectService} from '../../services/project.service';

import {Subscription} from 'rxjs/Subscription';

import * as _ from 'lodash';

// import the redux info
import {Store} from '@ngrx/store';
import * as fromRoot from '../../reducers';
import {Observable} from 'rxjs/Observable';
import * as actions from '../../actions/project.action';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [
    routerAnimation,
    listAnimation
  ],

  // tell the component to execute the opPush strategy
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit, OnDestroy {

  // bind the router animation with the whole component,
  @HostBinding('@routerAnim') state;

  /*
  projects = [
    {
      "id": 1,
      "name": 'task management platform',
      "desc": 'this is one task management platform',
      "coverImg": 'assets/img/covers/0.jpg'
    },
    {
      "id": 2,
      "name": ' new task management platform',
      "desc": 'this is new task management platform',
      "coverImg": 'assets/img/covers/1.jpg'
    }
  ] */

  // projects = [];
  projects$: Observable<Project[]>

  // sub: Subscription;
  listAnim$: Observable<number>

  // 1. inject cd: ChangeDetectorRef
  constructor(
    private diaglog: MdDialog, 
    private cd: ChangeDetectorRef,
    // private service$: ProjectService
    private store$: Store<fromRoot.State>
  ) { 
    // call loadaction method in effects file
    this.store$.dispatch(new actions.LoadAction(null));
    this.projects$ = this.store$.select(fromRoot.getProjects);
    // get he projects array length
    this.listAnim$ = this.projects$.map(p => p.length);
  }

  ngOnInit() {
    /*
    this.sub = this.service$.get("1").subscribe(projects => {
      this.projects = projects;

      // if get the data from server end, must do dirty value check. because it use the 
      this.cd.markForCheck();
    });
    */
  }

  ngOnDestroy() {
  }

  // click to open the new project dialog, this dialog is put in the entryComponents.
  openNewProjectDialog() {

    const selectedImg = `/assets/img/covers/${Math.floor(Math.random() * 40)}_tn.jpg`;

    // open the newProjectComponent and send data to the new component
    const dialogRef = this.diaglog.open(
      NewProjectComponent, 
      {data: {thumbnails: this.getThumbnails(), img: selectedImg}});

    // the dislogref will receive the data from another one.
    dialogRef.afterClosed()

    // just need one, donot need unsubscribe
      .take(1)
    // confirm here has value
      .filter(n => n)
      // for the add service, I also need to subscribe
      .map(val => ({...val, coverImg: this.buildImgSrc(val.coverImg)}))

      // for each stream, I use add method to create project.
      // .subscribe(project => console.log(project));
      .subscribe(project => {
        // by store dispath to create the new project
        this.store$.dispatch(new actions.AddAction(project));
      });
  }

  OpenInviteDialog(project: Project) {

    this.store$.select(fromRoot.getProjectUsers(project.id))
      .map(users => this.diaglog.open(InviteComponent, {data: {members: users}}))
      .switchMap(dialogRef => dialogRef.afterClosed().take(1).filter(n => n))
      .subscribe(val => this.store$.dispatch(new actions.InviteAction({projectId: project.id, members: val})));
  }

  OpenUpdateDialog(project: Project) {

    const selectedImg = `/assets/img/covers/${Math.floor(Math.random() * 40)}_tn.jpg`;
    
      // open the newProjectComponent and send data to the update component
      const dialogRef = this.diaglog.open(
        NewProjectComponent, 
        {data: {thumbnails: this.getThumbnails(), project: project}});
  
      // the dislogref will receive the data from another one.
      dialogRef.afterClosed()
  
      // just need one, donot need unsubscribe
        .take(1)
      // confirm here has value
        .filter(n => n)
        
        .map(val => ({...val, id: project.id, coverImg: this.buildImgSrc(val.coverImg)}))
        // .subscribe(project => console.log(project));
        .subscribe(project => {
          this.store$.dispatch(new actions.UpdateAction(project));
      });
  }

  OpenConfirmDialog(project) {
    const dialogRef = this.diaglog.open(ConfirmDialogComponent, {data: {title: 'Delete Project', content: 'Are you sure delete this project?'}});
    dialogRef.afterClosed()
    // just delete one
      .take(1)
      .filter(n => n)
      .subscribe(_ => {
        this.store$.dispatch(new actions.DeleteAction(project))
    });
  }

  private getThumbnails() {
    return _.range(0, 40)
      .map(i => `/assets/img/covers/${i}_tn.jpg`);
  }

  private buildImgSrc(img: string): string {
    console.log('ok');
    return img.indexOf("_") > -1 ? img.split("_")[0] + '.jpg' : img;
  }

  selectProject(project: Project) {
    this.store$.dispatch(new actions.SelectProjectAction(project));
  }

}
           