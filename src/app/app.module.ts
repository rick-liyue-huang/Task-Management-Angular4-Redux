import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import {AppRoutingModule} from './app-routing.module';

import {SharedModule} from './shared/shared.module';
import {LoginModule} from './login/login.module';
import {ProjectModule} from './project/project.module';
import {TaskModule} from './task/task.module';

// just load once, 
import {CoreModule} from './core/core.module';

import { AppComponent } from './app.component';
// // used for the angular animations
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule,
    // MdSidenavModule,
    // AppRoutingModule,
    LoginModule,
    ProjectModule,
    TaskModule,
    // BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
