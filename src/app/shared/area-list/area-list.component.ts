

import { Component, OnInit, forwardRef, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { 
  ControlValueAccessor, 
  NG_VALUE_ACCESSOR, 
  NG_VALIDATORS, 
  FormControl, 
  FormBuilder, 
  FormGroup
} from '@angular/forms';

import {Address} from '../../domain';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

import {getCitiesByProvince, getprovinces, getDistrictByProvinceAndCity} from '../../utils/area.util';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.scss'],

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,

      // will wait until the 'ImageListSelectComponent' instance, and then DI
      useExisting: forwardRef(() => AreaListComponent),
      // one for mult
      multi: true
    },
    {
      provide: NG_VALIDATORS,

      // will wait until the 'ImageListSelectComponent' instance, and then DI
      useExisting: forwardRef(() => AreaListComponent),
      // one for mult
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AreaListComponent implements OnInit, OnDestroy, ControlValueAccessor {

  _address: Address = {
    province: '',
    city: '',
    district: '',
    street: ''
  };

  // define the subject event
  _province = new Subject();
  _city = new Subject();
  _district = new Subject();
  _street = new Subject();

  // define the series data 
  provinces$: Observable<string[]>;
  cities$: Observable<string[]>;
  districts$: Observable<string[]>;
  



  private propagateChange = (_: any) => {};

  // define the subscription and let it be destroyed in onDestroy()
  private sub: Subscription;

  constructor() { }

  ngOnInit() {
    // list the easy event stream: province city district street
    const province$ = this._province.asObservable().startWith('');
    const city$ = this._city.asObservable().startWith('');
    const district$ = this._district.asObservable().startWith('');
    const street$ = this._street.asObservable().startWith('');

    // because the address is made of the four parts, any one change will lead the new address by array []
    const val$ = Observable.combineLatest([province$, city$, district$, street$], (_p, _c, _d, _s) => {

      // get the new val$ (address)
      return {
        province: _p,
        city: _c,
        district: _d,
        street: _s
      };
    });
    // when get the new val, emit to outside, and let outside know that
    this.sub = val$.subscribe(v => {
      this.propagateChange(v);
    });

    // through function to get array, and then transfer to stream
    this.provinces$ = Observable.of(getprovinces());

    // cities are under the special province
    this.cities$ = province$.map((p: string) => getCitiesByProvince(p));

    // district are under special province and city
    this.districts$ = Observable.combineLatest(province$, city$, (p: string, c: string) => getDistrictByProvinceAndCity(p, c));

  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  // here _province is the observer
  writeValue(obj: Address): void {
    if (obj) {
      this._address = obj;
    }
    if (this._address.province) {
      this._province.next(this._address.province);
    }
    if (this._address.city) {
      this._city.next(this._address.city);
    }
    if (this._address.district) {
      this._district.next(this._address.district);
    }
    if (this._address.street) {
      this._street.next(this._address.street);
    }
  }
  
  // if the target tag value changed, tell the form
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  
  // the target tag touched change, it will tell form
  registerOnTouched(fn: any): void {

  }

  validate(fc: FormControl): {[key: string]: any} {
    
    const val = fc.value;
    if (!val) {
      return null;
    }

    if (val.province && val.city && val.district && val.street) {
      return null;
    }
    return {
      addressInvalid: true
    }
  }

  onProvinceChange() {
    this._province.next(this._address.province);
  }

  onCityChange() {
    this._city.next(this._address.city);
  }

  onDistrictChange() {
    this._district.next(this._address.district);
  }

  onStreetChange() {
    this._street.next(this._address.street);
  }

}

