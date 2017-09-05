
// use inject to get the DI
import { Component, Inject } from '@angular/core';

import {OverlayContainer} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  darkTheme = false;

  // because newproject component is entryComponents, so need oc to show the themeclass.
  // DI normally inject to constructor, this is the singlet object
  constructor(private oc: OverlayContainer, @Inject('BASE_CONFIG') config) {
    console.log(config);
  }

  switchTheme(dark) {
    this.darkTheme = dark;

    this.oc.themeClass = dark ? 'myapp-dark-theme' : null;
  }

  
}
