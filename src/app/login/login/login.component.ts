
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
// import the forms functions
import { FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';

// import the service as event stream
import {QuoteService} from '../../services/quote.service'
import {Quote} from '../../domain/quote.model';

import {Observable} from 'rxjs/Observable';

import {Store} from '@ngrx/store';
import * as fromRoot from '../../reducers/index';
// import * as actions  from '../../actions/quote.action';
import * as actions from '../../actions/quote.action';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  // bind the [FormGroup]="loginForm" in 'login.component.html'
  loginForm: FormGroup;

  // let quote become stream
  quote$: Observable<Quote>;

  // inject the formBuilder
  constructor(
    private fb: FormBuilder,

    // this is a event stream, QuoteService is '@Injectable()'.
    private quoteService$: QuoteService,
    private store$: Store<fromRoot.State>) {
      
      //22.  store$ can emit the action and also get the state, and will get the new state
      // this.quote$ = this.store$.select(state => state.quote.quote);
      this.quote$ = this.store$.select(fromRoot.getQuote);

      // it will get the Quote type Observable
      this.quoteService$
        .getQuote()
        // // and then assign the event stream to this.quote
        // .subscribe(q => this.quote = q);
        .subscribe(q => {
          
          //11. when action is successful, it transfer the info, it will get the new state --- q
          // this.store$.dispatch({type: actions.QUOTE_SUCCESS, payload: q})
          this.store$.dispatch(new actions.LoadSuccessAction(q));
          
          // notice: use reducer will lead to not control the state directly, but control the action under defined.
        });
        
     }

  ngOnInit() {

    /*
    // when initiate the form, setting the form data and validators
    this.loginForm = new FormGroup({

      // formControl to bind 'formControlName'
      email: new FormControl('rick@gmail.com', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.required)
    });

    */

    this.loginForm = this.fb.group({
      email: ['rick@rick.gmail', Validators.compose([Validators.required, Validators.email, this.validate])],
      password: ['', Validators.required]
    });
  }

  // when submit the form, it will transmit the data and valid.
  //  {value, valid} === form
  onSubmit({value, valid}, ev: Event) {

    ev.preventDefault();

    console.log(JSON.stringify(value));
    console.log(JSON.stringify(valid));

    /*
    for the conditional validator, it is when some condition satisfied, it will valide some validator.
    if (condition) {
      this.loginForm.controls['email'].setValidators(this.validate);
    }
    */
  }

  // define the validator 
  validate(fc: FormControl): {[key: string]: any} {
    if (!fc.value) {
      return null;
    }

    const pattern = /^rick+/;
    if (pattern.test(fc.value)) {
      return null;
    }
    return {
      // bind {{loginForm.controls['email'].errors | json }}
      emailNotValid: 'the email must be valid'
    }
  }

}
