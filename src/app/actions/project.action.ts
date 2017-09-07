


import { Action } from '@ngrx/store';
import { type } from '../utils/type.util';
import {Project, User} from '../domain';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 * 
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique. 
 */
export const ActionTypes = {
  ADD:              type('[Project] Add'),
  ADD_SUCCESS:      type('[Project] Add_Success'),
  ADD_FAIL:         type('[Project] Add_Fail'),
  UPDATE:              type('[Project] Update'),
  UPDATE_SUCCESS:      type('[Project] Update_Success'),
  UPDATE_FAIL:         type('[Project] Update_Fail'),
  DELETE:              type('[Project] Delete'),
  DELETE_SUCCESS:      type('[Project] Delete_Success'),
  DELETE_FAIL:         type('[Project] Delete_Fail'),
  LOAD:              type('[Project] Load'),
  LOAD_SUCCESS:      type('[Project] Load_Success'),
  LOAD_FAIL:         type('[Project] Load_Fail'),
  INVITE:              type('[Project] Invite'),
  INVITE_SUCCESS:              type('[Project] Invite_Success'),
  INVITE_FAIL:              type('[Project] Invite_Fail'),
  SELECT_PROJECT:              type('[Project] Select_Project')
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful 
 * type checking in reducer functions.
 */
export class AddAction implements Action {
  type = ActionTypes.ADD;
    // load means that request to server, so no payload
    // when login I should return the email and password 
  constructor(public payload: Project) { }
}

export class AddSuccessAction implements Action {
    type = ActionTypes.ADD_SUCCESS;
    // when successful it will return auth
    constructor(public payload: Project) { }
}

export class AddFailAction implements Action {
    type = ActionTypes.ADD_FAIL;
    // if fail I prefer to get error message
    constructor(public payload: string) { }
}

export class UpdateAction implements Action {
    type = ActionTypes.UPDATE;
      // load means that request to server, so no payload
    constructor(public payload: Project) { }
  }
  
  export class UpdateSuccessAction implements Action {
      type = ActionTypes.UPDATE_SUCCESS;
  
      constructor(public payload: Project) { }
  }
  
  export class UpdateFailAction implements Action {
      type = ActionTypes.UPDATE_FAIL;
      // if fail I prefer to get error message
      constructor(public payload: string) { }
  }

  export class DeleteAction implements Action {
    type = ActionTypes.DELETE;
      // load means that request to server, so no payload
    constructor(public payload: Project) { }
  }
  
  export class DeleteSuccessAction implements Action {
      type = ActionTypes.DELETE_SUCCESS;
  
      constructor(public payload: Project) { }
  }
  
  export class DeleteFailAction implements Action {
      type = ActionTypes.DELETE_FAIL;
      // if fail I prefer to get error message
      constructor(public payload: string) { }
  }

  export class LoadAction implements Action {
    type = ActionTypes.LOAD;
      // load means that request to server, so no payload
    constructor(public payload: null) { }
  }
  
  export class LoadSuccessAction implements Action {
      type = ActionTypes.LOAD_SUCCESS;
  
      constructor(public payload: Project[]) { }
  }
  
  export class LoadFailAction implements Action {
      type = ActionTypes.LOAD_FAIL;
      // if fail I prefer to get error message
      constructor(public payload: string) { }
  }

  export class InviteAction implements Action {
    type = ActionTypes.INVITE;
      // load means that request to server, so no payload
    constructor(public payload: {projectId: string, members: User[]}) { }
  }
  
  export class InviteSuccessAction implements Action {
      type = ActionTypes.INVITE_SUCCESS;
  
      constructor(public payload: Project) { }
  }
  
  export class InviteFailAction implements Action {
      type = ActionTypes.INVITE_FAIL;
      // if fail I prefer to get error message
      constructor(public payload: string) { }
  }
  
  export class SelectProjectAction implements Action {
    type = ActionTypes.SELECT_PROJECT;
  
    constructor(public payload: Project) { }
  }

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = AddAction | AddSuccessAction | AddFailAction
    | UpdateAction | UpdateSuccessAction | UpdateFailAction
    | DeleteAction | DeleteSuccessAction | DeleteFailAction
    | LoadAction | LoadSuccessAction | LoadFailAction
    | InviteAction | InviteSuccessAction | InviteFailAction
    | SelectProjectAction;