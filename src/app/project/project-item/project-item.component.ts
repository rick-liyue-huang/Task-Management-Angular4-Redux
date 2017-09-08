

// for the dump component, only import ChangeDetectionStrategy
import { Component, OnInit, Input, Output, EventEmitter, HostBinding, HostListener, ChangeDetectionStrategy } from '@angular/core';

import {cardAnimation} from '../../animation/card.animation';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],

  animations: [
    cardAnimation
  ],
  // and tell the component execute the onpush strategy.
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectItemComponent implements OnInit {

  // here it input from 'project-list' component.
  @Input() item;

  @Output() onInvite = new EventEmitter<void>();

  @Output() onEdit = new EventEmitter<void>();

  @Output() onDelete = new EventEmitter<void>();

  @Output() onSelected = new EventEmitter<void>();  

  // same as [@card]='cardState' in project-item.component.html
  // here will animate the whole component, so use hostbinding
  @HostBinding('@card') cardState = 'out';

  constructor() { }

  ngOnInit() {
  }

  onInviteClick(ev: Event) {
    ev.stopPropagation();
    this.onInvite.emit();
  }

  onEditClick(ev: Event) {
    ev.stopPropagation();
    this.onEdit.emit();
  }

  onDeleteClick(ev: Event) {
    ev.stopPropagation();
    this.onDelete.emit();
  }

  onClick() {
    this.onSelected.emit();
  }

  // listen the array event to animate
  @HostListener('mouseenter')
  onMouseEnter() {
    this.cardState = 'hover';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.cardState = 'out';
  }

}
