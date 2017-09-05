
import { Component, OnInit, Input, Output, EventEmitter, HostListener, ChangeDetectionStrategy } from '@angular/core';
import {itemAnimation} from '../../animation/item.animation';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,

  // define the animation 
  animations: [
    itemAnimation
  ]
})
export class TaskItemComponent implements OnInit {

  @Input() item;
  @Input() avatar;

  @Output() taskClick = new EventEmitter<void>();

  widerPriority = 'out';

  constructor() { }

  ngOnInit() {
    this.avatar = this.item.owner ? this.item.owner.avatar : 'unassigned';
  }

  onItemClick() {
    this.taskClick.emit();
  }

  onCheckBoxClick(ev: Event) {
    // avoid the event propagate to outside
    ev.stopPropagation();
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.widerPriority = 'in';
  }

  @HostListener('mouseleave')
  onmouseleave() {
    this.widerPriority = 'out';
  }

}
