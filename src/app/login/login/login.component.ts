
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
// import the forms functions
import { FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';

// import the service as event stream
// import {QuoteService} from '../../services/quote.service' // because the effect
import {Quote} from '../../domain/quote.model';

import {Observable} from 'rxjs/Observable';

import {Store} from '@ngrx/store';
import * as fromRoot from '../../reducers/index';
// import * as actions  from '../../actions/quote.action';
import * as actions from '../../actions/quote.action';
import * as authActions from '../../actions/auth.action';

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
    // private quoteService$: QuoteService, // delete it because effect
    private store$: Store<fromRoot.State>) {
      
      //22.  store$ can emit the action and also get the state, and will get the new state
      // this.quote$ = this.store$.select(state => state.quote.quote);
      this.quote$ = this.store$.select(fromRoot.getQuote);
      
      // have to dispatch the 'load' method to load the quote from outside in the intial statge
      this.store$.dispatch(new actions.LoadAction(null));
      

      /*
      // I do not need this service, because I deal with it in the effects
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

        */
        
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
      email: ['rick@rick.gmail', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });
  }

  // when submit the form, it will transmit the data and valid.
  //  {value, valid} === form
  onSubmit({value, valid}, ev: Event) {

    ev.preventDefault();

    // console.log(JSON.stringify(value));
    // console.log(JSON.stringify(valid));
    if (!valid) {
      return;
    }

    /*
    因为store$ 是用来保存上一次状态和发送动作的，这里当发送动作后会执行loginaction的事件，通过auth.action.ts我们知道
    loginaction 事件将会发送state 然后返回新的state.在auth.effects.ts里面，我们处理这个loginaction事件，通过事件流的处理
    map到其他的事件流，如果成功了就执行loginsuccessaction, 否则就执行loginfailaction事件。在 auth.action我们定义了这两个事件，
    但是具体如何执行都是在action.reducer.ts里面，因为reducer只是涉及到从外面获取状态后，在UI之间的转换。并且我们在auth.effects.ts
    里面也定义了新的元数据， 用来监听登陆成功和注册成功，因为这里面涉及到页面的请求，所以也将其放入到effects里面。
    
    */
    // it only need value ({email, password})
    this.store$.dispatch(new authActions.LoginAction(value));

    /*
    for the conditional validator, it is when some condition satisfied, it will valide some validator.
    if (condition) {
      this.loginForm.controls['email'].setValidators(this.validate);
    }
    */
  }
  
  /*
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

  */

}
