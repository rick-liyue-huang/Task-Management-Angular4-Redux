

import { Action } from '@ngrx/store';
import { type } from '../utils/type.util';
import {Auth} from '../domain';
import {User} from '../domain';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 * 
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique. 
 */
export const ActionTypes = {
  LOGIN:              type('[Auth] Login'),
  LOGIN_SUCCESS:      type('[Auth] Login_Success'),
  LOGIN_FAIL:         type('[Auth] Login_Fail'),
  REGISTER:           type('[Auth] Register'),
  REGISTER_SUCCESS:   type('[Auth] Register_Success'),
  REGISTER_FAIL:      type('[Auth] Register_Fail'),
  LOGOUT:             type('[Auth] Logout')
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful 
 * type checking in reducer functions.
 */
export class LoginAction implements Action {
  type = ActionTypes.REGISTER;
    // load means that request to server, so no payload
  constructor(public payload: {email: string, password: string}) { }
}

export class LoginSuccessAction implements Action {
    type = ActionTypes.REGISTER_SUCCESS;

    constructor(public payload: Auth) { }
}

export class LoginFailAction implements Action {
    type = ActionTypes.REGISTER_FAIL;
    // if fail I prefer to get error message
    constructor(public payload: string) { }
}

export class RegisterAction implements Action {
    type = ActionTypes.LOGIN;
      // load means that request to server, so no payload
    constructor(public payload: User) { }
  }
  
  export class RegisterSuccessAction implements Action {
      type = ActionTypes.LOGIN_SUCCESS;
  
      constructor(public payload: Auth) { }
  }
  
  export class RegisterFailAction implements Action {
      type = ActionTypes.LOGIN_FAIL;
      // if fail I prefer to get error message
      constructor(public payload: string) { }
  }

  export class LogoutAction implements Action {
    type = ActionTypes.LOGOUT;
    // if fail I prefer to get error message
    constructor(public payload: Auth) { }
}    

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = LoginAction | LoginSuccessAction | LoginFailAction 
      | RegisterAction | RegisterSuccessAction | RegisterFailAction;