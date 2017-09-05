

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

  projects = [];

  sub: Subscription;

  // 1. inject cd: ChangeDetectorRef
  constructor(
    private diaglog: MdDialog, 
    private cd: ChangeDetectorRef,
    private service$: ProjectService
  ) { }

  ngOnInit() {
    this.sub = this.service$.get("1").subscribe(projects => {
      this.projects = projects;

      // if get the data from server end, must do dirty value check. because it use the 
      this.cd.markForCheck();
    });
    
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    
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
      .switchMap(v => this.service$.add(v))
      // .subscribe(project => console.log(project));
      .subscribe(project => {
        // add this project on array.
        this.projects = [...this.projects, project];

        // must dirty value check.
        this.cd.markForCheck();
      });
  }

  OpenInviteDialog(project) {
    const dialogRef = this.diaglog.open(InviteComponent, {data: {members: []}});
    
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
  
        // for each stream, I use update method to create project.
        .switchMap(v => this.service$.update(v))
        // .subscribe(project => console.log(project));
        .subscribe(project => {
          // add this project on array.
          const index = this.projects.map(p => p.id).indexOf(project.id);
          this.projects = [...this.projects.slice(0, index), project, ...this.projects.slice(index + 1)];
  
          // must dirty value check.
          this.cd.markForCheck();
      });
  }

  OpenConfirmDialog(project) {
    const dialogRef = this.diaglog.open(ConfirmDialogComponent, {data: {title: 'Delete Project', content: 'Are you sure delete this project?'}});
    dialogRef.afterClosed()
    // just delete one
      .take(1)
      .filter(n => n)
      .switchMap(_ => this.service$.del(project))
      .subscribe(prj => {
      this.projects = this.projects.filter(p => p.id !== prj.id);

      // same as 2.tell the component that only execute this branch by markforcheck
      this.cd.markForCheck();
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

}
           