import { Component, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  // it used for change the sidebar spread in the app.html
  @Output() toggle = new EventEmitter<void>();

  // it used for change the whole page theme change
  @Output() toggleDarkTheme = new EventEmitter<Boolean>();

  constructor() { 
    
  }

  ngOnInit() {
  }

  // becausee header does not know the sidebar info, so I use Ouput() and emmit outside
  openSideBar() {
    this.toggle.emit();
  }

  // let the whole project know that.
  onChange(checked: boolean) {
    this.toggleDarkTheme.emit(checked);
  }

}
