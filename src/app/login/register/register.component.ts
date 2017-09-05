
import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';

import {getAddrByCode, isValidAddr, extractInfo} from '../../utils/identity.util';
import {isValidDate} from '../../utils/date.util';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  items: string[];

  registerForm: FormGroup;

  sub: Subscription;

  private readonly avatarName = 'avatars';

  constructor(private fb: FormBuilder) { }

  ngOnInit() {

    // cheack the original file to get the items
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    this.items = nums.map(d => `avatars:svg-${d}`);
    const img = `${this.avatarName}:svg-${Math.floor(Math.random() * 16).toFixed(0)}`;

    this.registerForm = this.fb.group({
      email: [],
      name: [],
      password: [],
      confirmpassword: [],
      avatar: [img],
      dateOfBirth: ['1990-01-01'],

      address: [],
      identity: [],
    });

    // get the id stream
    const id$ = this.registerForm.get('identity').valueChanges
    
      .debounceTime(300)
      // after validate true to emit
      .filter(v => this.registerForm.get('identity').valid);
      // when I get the Observable stream, I will subscribe it and get some value to input to date and address component.
      this.sub = id$.subscribe(id => {
        // get the identityNo from id
        const info = extractInfo(id.identityNo);

        // if the address info is valie
        if (isValidAddr(info.addrCode)) {
          // get the address info from identity number
          const addr = getAddrByCode(info.addrCode);
          // and then update the address input type by address info
          this.registerForm.get('address').patchValue(addr);
        }
        if (isValidDate(info.dateOfBirth)) {
          this.registerForm.get('dateOfBirth').patchValue(info.dateOfBirth);
        }
      });
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onSubmit({value, valid}, ev: Event) {
    
    ev.preventDefault();
    
    if (!valid) {
      return;
    }
    console.log(value);
  }

}
