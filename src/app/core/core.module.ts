import { NgModule, SkipSelf, Optional } from '@angular/core';

import {HttpModule} from '@angular/http';

import {MdIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {loadSvgResources} from '../utils/svg.util';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import {SharedModule} from '../shared/shared.module';

import {AppRoutingModule} from '../app-routing.module';
// used for the angular animations
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// define the service and import
import {ServicesModule} from '../services/services.module';

import {AppStoreModule} from '../reducers/';
import {AppEffectsModule} from '../effects';

import '../utils/debug.util';

import 'hammerjs';
import '../utils/debug.util';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/defaultIfEmpty';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/count';
import 'rxjs/add/operator/do';

@NgModule({
  imports: [
    HttpModule,
    SharedModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppStoreModule,
    AppEffectsModule,
    // show the service example
    ServicesModule.forRoot(),
  ],
  declarations: [
    HeaderComponent, 
    FooterComponent, 
    SidebarComponent
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppStoreModule
  ],

  // provides the DI with string value
  providers: [
    {
      provide: 'BASE_CONFIG', useValue: {
      uri: 'http://localhost:3000'
    }
  }
  ]

})
export class CoreModule { 

  // @skipSelf --- search the parent firstly. @Optional() --- if not exist, just load from its parent.
  constructor(
    @Optional() @SkipSelf() parent: CoreModule,
    ir: MdIconRegistry,
    ds: DomSanitizer) {  // DI: parent

    // just need it load once
    if (parent) {
      throw new Error('core module has existed, cannot laod again');
    }
    // just load once in the whole project.
    loadSvgResources(ir, ds);
  }
}
