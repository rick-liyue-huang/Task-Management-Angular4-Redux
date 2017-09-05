
import { Component, OnInit } from '@angular/core';
// import the forms functions
import { FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';

// import the service as event stream
import {QuoteService} from '../../services/quote.service'
import {Quote} from '../../domain/quote.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // bind the [FormGroup]="loginForm" in 'login.component.html'
  loginForm: FormGroup;

  // let q become the Quote type.
  quote: Quote = {
    cn: "我们在人生中会作出许多选择，带着这些选择继续生活，才是人生中最难的一课。《妙笔生花》",
    en: "We all make our choices in life. The hard thing to do is live with them.",
    pic: "/assets/img/quotes/6.jpg"
  };

  // inject the formBuilder
  constructor(
    private fb: FormBuilder,

    // this is a event stream, QuoteService is '@Injectable()'.
    private quoteService$: QuoteService) {

      // it will get the Quote type Observable
      this.quoteService$
        .getQuote()
        // and then assign the event stream to this.quote
        .subscribe(q => this.quote = q);
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
