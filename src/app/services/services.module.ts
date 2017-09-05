
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import {QuoteService} from './quote.service';

// import the projectservice
import {ProjectService} from './project.service';
import {TaskListService} from './task-list.service';
import {TaskService} from './task.service';
import {UserService} from './user.service';
import {AuthService} from './auth.service';
import {AuthGuardService} from './auth-guard.service';


@NgModule()
export class ServicesModule {

  // provide a static service
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [
        QuoteService,
        ProjectService,
        TaskListService,
        TaskService,
        UserService,
        AuthService,
        AuthGuardService
      ]
    }
  }
 }
