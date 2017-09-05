
import { Directive, HostListener, Input, ElementRef, Renderer2 } from '@angular/core';

import {DragDropService} from '../drag-drop.service';


@Directive({
  // app-draggable and draggedClass will be inputed by the target element
  selector: '[app-draggable][draggedClass][dragTag][dragData]'
})
export class DragDirective {

  private _isDraggable = false;

  @Input('app-draggable')

  // let the target element become draggable or not, need to set attribute
  set isDraggable(value: boolean) {
    this._isDraggable = value;
    this.rd.setAttribute(this.el.nativeElement, 'draggable', `${value}`);
  }

  get isDraggable() {
    return this._isDraggable;
  }


  @Input() draggedClass: string;

  // define the identified tag
  @Input() dragTag: string;
  @Input() dragData: any;

  constructor(

    // el and rd used for control the dom element
    private el: ElementRef, 
    private rd: Renderer2, 
    private service: DragDropService) { }

  @HostListener('dragstart', ['$event'])
  ondragStart(ev: Event) {
    if(this.el.nativeElement === ev.target) {
      this.rd.addClass(this.el.nativeElement, this.draggedClass);

      // when dragstart it will transmit the data
      this.service.setDragData({tag: this.dragTag, data: this.dragData});
    }
  }

  @HostListener('dragend', ['$event'])
  ondragend(ev: Event) {
    if (this.el.nativeElement === ev.target) {
      this.rd.removeClass(this.el.nativeElement, this.draggedClass);
    }
  }


}
