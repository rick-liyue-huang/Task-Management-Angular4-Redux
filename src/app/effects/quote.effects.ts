

// effect is another reducer, I hope to deal with the effect and reducer by the action stream
import { Injectable } from '@angular/core';
import {Actions, toPayload, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import * as actions from '../actions/quote.action';
import {QuoteService} from '../services/quote.service';

@Injectable()
export class QuoteEffets {
    
    
    // effect is one type of Action stream
    // 1. listen the action$ stream
    @Effect()
    // used for filtering the action type
    // 2. get 'LOAD' action
    quote$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.LOAD)
        // deal with this stream.
        .map(toPayload)
        // get the service method to get quote
        // 在处理完一种逻辑后，轻松地转到另外的逻辑上去 ： 获得数据流，然后通过map对另外的逻辑进行操作。
        .switchMap(_ => this.service$.getQuote()
        //  if success, load the success action
        .map(q => new actions.LoadSuccessAction(q))
        // if fail, load the fail action
        .catch(err => Observable.of(new actions.LoadFailAction(JSON.stringify(err))))
    );

    // notice that: the effects stream will effect the reducer stream.
    

    constructor(private actions$: Actions, private service$: QuoteService) {}
}