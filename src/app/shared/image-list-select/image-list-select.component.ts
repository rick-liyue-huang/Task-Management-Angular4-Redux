

//  self defined form, and let other form use this self-defined form
import { Component, OnInit, Input, forwardRef } from '@angular/core';

// let the shared one become form 
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl} from '@angular/forms';

@Component({
  selector: 'app-image-list-select',
  templateUrl: './image-list-select.component.html',
  styleUrls: ['./image-list-select.component.scss'],

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,

      // will wait until the 'ImageListSelectComponent' instance, and then DI
      useExisting: forwardRef(() => ImageListSelectComponent),
      // one for mult
      multi: true
    },
    {
      provide: NG_VALIDATORS,

      // will wait until the 'ImageListSelectComponent' instance, and then DI
      useExisting: forwardRef(() => ImageListSelectComponent),
      // one for mult
      multi: true
    }
  ]
})
export class ImageListSelectComponent implements ControlValueAccessor {

  // deal with the icon
  @Input() title: string = 'choose';
  @Input() cols: number = 6;
  @Input() rowHeight: string = '64px';
  @Input() items: string[] = [];

  // deal with the image
  @Input() useSvgIcon = false;
  @Input() itemWidth = '80px';

  selected: string;
  constructor() { }

  private propagationChange = (_: any) => {};

  onChange(i) {
    this.selected = this.items[i];
    this.propagationChange(this.selected);
  }

  // must 
  // used for write value
  writeValue(obj: any): void {
    this.selected = obj;
  }
  
  // if the target tag value changed, tell the form
  registerOnChange(fn: any): void {
    this.propagationChange = fn;
  }
  
  // the target tag touched change, it will tell form
  registerOnTouched(fn: any): void {

  }

  //  is the validator for the whole self-defined form
  // bind with provide: NG_VALIDATORS,
  validate(fc: FormControl): {[key: string]: any} {
    return this.selected ? null : {
      imageListInvalid: {
        valid: false
      }
    };
  }

}
