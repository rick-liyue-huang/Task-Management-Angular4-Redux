

import { Component, OnInit, forwardRef, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { 
  ControlValueAccessor, 
  NG_VALUE_ACCESSOR, 
  NG_VALIDATORS, 
  FormControl, 
  FormBuilder, 
  FormGroup
} from '@angular/forms';

import {IdentityType, Identity} from '../../domain';
import { Subject } from "rxjs/Subject";
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';


@Component({
  selector: 'app-identity-input',
  templateUrl: './identity-input.component.html',
  styleUrls: ['./identity-input.component.scss'],

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,

      // will wait until the 'ImageListSelectComponent' instance, and then DI
      useExisting: forwardRef(() => IdentityInputComponent),
      // one for mult
      multi: true
    },
    {
      provide: NG_VALIDATORS,

      // will wait until the 'ImageListSelectComponent' instance, and then DI
      useExisting: forwardRef(() => IdentityInputComponent),
      // one for mult
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IdentityInputComponent implements OnInit, OnDestroy, ControlValueAccessor {


  identityTpes = [
    {
      value: IdentityType.IdCard,
      label: 'ID Card'
    },
    {
      value: IdentityType.Passport,
      label: 'Passport'
    },
    {
      value: IdentityType.Insurance,
      label: 'Insurance Card'
    },
    {
      value: IdentityType.Militory,
      label: 'Militoryd Card'
    },
    {
      value: IdentityType.Other,
      label: 'Other Cards'
    }
  ];

  identity: Identity = {identityType: null, identityNo: null};

  private _idType = new Subject<IdentityType>();
  private _idNo = new Subject<string>();

  private propagateChange = (_: any) => {};
  // define the subscription and let it be destroyed in onDestroy()
  private sub: Subscription;

  constructor() { }

  ngOnInit() {
    const val$ = Observable.combineLatest(this.idNo, this.idType, (_no, _type) => {

      return {
        idtentiyType: _type,
        identityNo: _no
      }
    });

    this.sub = val$.subscribe(id => {
      // emit this change outside
      this.propagateChange(id);
    })
  }

  // match with the ngOnInit
  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  public writeValue(obj: Identity) {
    // 我们接受外部射给我们的一个值后，放到自己的dom中，绑定到自己的ngmodel的模型中来
    if (obj) {
      this.identity = obj; // 也就是将其赋值给identity
    }
  }
  
  // if the target tag value changed, tell the form
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  
  // the target tag touched change, it will tell form
  registerOnTouched(fn: any): void {

  }

  // is the validator for the whole self-defined form
  // bind with provide: NG_VALIDATORS,
  validate(fc: FormControl): {[key: string]: any} {
    
    const val = fc.value;
    if (!val) {
      return null;
    }

    switch (val.identityType) {
      case IdentityType.IdCard: {
        return this.validateIdCard(fc);
      }
      case IdentityType.Passport: {
        return this.validatePassport(fc);
      }
      case IdentityType.Militory: {
        return this.validateMilitory(fc);
      }
      case IdentityType.Insurance:
      case IdentityType.Other:
      default: {
        return null;
      }
    }
  }

  validateIdCard(fc: FormControl): {[key: string]: any} {
    const val = fc.value.identityNo;
    if (val.length !== 18) {
      return {idInvalid: true};
    }

    const pattern = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}[x0-9]$/;
    return pattern.test(val) ? null : {idNotValid: true};   
  }

  validatePassport(fc: FormControl): {[key: string]: any} {
    const val = fc.value.identityNo;
    if (val.length !== 9) {
      return {idInvalid: true};
    }

    const pattern = /^[GgEe]\d{8}$/;;
    return pattern.test(val) ? null : {idNotValid: true};   
  }

  validateMilitory(fc: FormControl): {[key: string]: any} {
    const val = fc.value.identityNo;

    const pattern = /[\u4e00-\u9fa5](字第)(\d{4,8})(号?)$/;
    return pattern.test(val) ? null : {idNotValid: true};   
  }

  // _idType is the Observer
  onIdTypeChange(idType: IdentityType) {

    this._idType.next(idType);
  }

  onIdNoChange(idNo: string) {
    this._idNo.next(idNo);
  }

  // _idType is the Observable
  get idType(): Observable<IdentityType> {
    return this._idType.asObservable();
  }

  get idNo(): Observable<string> {
    return this._idNo.asObservable();
  }

}
