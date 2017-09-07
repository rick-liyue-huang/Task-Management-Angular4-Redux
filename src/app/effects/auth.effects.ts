

// effect is another reducer, I hope to deal with the effect and reducer by the action stream
import { Injectable } from '@angular/core';
import {Actions, toPayload, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import {go} from '@ngrx/router-store';
import * as actions from '../actions/auth.action';
import {AuthService} from '../services/auth.service';
import {User} from '../domain';

@Injectable()
export class AuthEffets {
    
    
    // effect is one type of Action stream
    // 1. listen the action$ stream
    @Effect()
    // used for filtering the action type
    // 2. get 'login' action
    login$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.LOGIN)
        // deal with this stream.
        .map(toPayload)
        // get the service method to get quote
        // 在处理完一种逻辑后，轻松地转到另外的逻辑上去 ： 获得数据流，然后通过map对另外的逻辑进行操作。
        .switchMap(({email, password}) => this.service$.login(email, password)
        //  if success, load the success action
        // it will return the auth type
        .map(auth => new actions.LoginSuccessAction(auth))
        // if fail, load the fail action
        // it will return error
        .catch(err => Observable.of(new actions.LoginFailAction(JSON.stringify(err))))
    );

    @Effect()
    // used for filtering the action type
    // 2. get 'register' action
    register$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.REGISTER)
        // deal with this stream.
        .map(toPayload)
        // get the service method to get quote
        // 在处理完一种逻辑后，轻松地转到另外的逻辑上去 ： 获得数据流，然后通过map对另外的逻辑进行操作。
        // 对照service的register方法，输入user 返回 auth
        .switchMap((user: User) => this.service$.register(user)
        //  if success, load the success action
        .map(auth => new actions.RegisterSuccessAction(auth))
        // if fail, load the fail action
        .catch(err => Observable.of(new actions.RegisterFailAction(JSON.stringify(err))))
    );

    @Effect()
    logout$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.LOGOUT)
        // deal with this stream.
        .map(_ => go(['/'])); // route to the index
    
        // if login successful, it will jump to index page
    @Effect()
    loginAndNavigate$: Observable<Action> = this.actions$
        // here i listen the loginsuccess from the upone method
        .ofType(actions.ActionTypes.LOGIN_SUCCESS)
        // deal with this stream.
        // 流的拼接
        .map(_ => go(['/projects'])); // route to the index

    @Effect()
    registerAndNavigate$: Observable<Action> = this.actions$
        
        .ofType(actions.ActionTypes.REGISTER_SUCCESS)
        // deal with this stream.
        .map(_ => go(['/projects'])); // route to the index
    
    // notice that: the effects stream will effect the reducer stream.
    

    constructor(private actions$: Actions, private service$: AuthService) {}
}