


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
  ADD:                 type('[Project] Add'),
  ADD_SUCCESS:         type('[Project] Add_Success'),
  ADD_FAIL:            type('[Project] Add_Fail'),
  UPDATE:              type('[Project] Update'),
  UPDATE_SUCCESS:      type('[Project] Update_Success'),
  UPDATE_FAIL:         type('[Project] Update_Fail'),
  DELETE:              type('[Project] Delete'),
  DELETE_SUCCESS:      type('[Project] Delete_Success'),
  DELETE_FAIL:         type('[Project] Delete_Fail'),
  LOAD:                type('[Project] Load'),
  LOAD_SUCCESS:        type('[Project] Load_Success'),
  LOAD_FAIL:           type('[Project] Load_Fail'),
  INVITE:              type('[Project] Invite'),
  INVITE_SUCCESS:      type('[Project] Invite_Success'),
  INVITE_FAIL:         type('[Project] Invite_Fail'),
  SELECT_PROJECT:      type('[Project] Select_Project')
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful 
 * type checking in reducer functions.
 */
export class AddAction implements Action {
  type = ActionTypes.ADD;
    // here action.payload bring the project wanted to add.
  constructor(public payload: Project) { }
}

export class AddSuccessAction implements Action {
    type = ActionTypes.ADD_SUCCESS;
    // when successful it will return project by action.payload
    constructor(public payload: Project) { }
}

export class AddFailAction implements Action {
    type = ActionTypes.ADD_FAIL;
    // if fail I prefer to get error message
    constructor(public payload: string) { }
}

export class UpdateAction implements Action {
    type = ActionTypes.UPDATE;
    // when update, I will bring the project by action.payload
    constructor(public payload: Project) { }
  }
  
  export class UpdateSuccessAction implements Action {
      type = ActionTypes.UPDATE_SUCCESS;
      // when successful, it retun the project by action.payload
      constructor(public payload: Project) { }
  }
  
  export class UpdateFailAction implements Action {
      type = ActionTypes.UPDATE_FAIL;
      // if fail I prefer to get error message
      constructor(public payload: string) { }
  }

  // delete project as as add and update
  export class DeleteAction implements Action {
    type = ActionTypes.DELETE;
      
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
  
  // for the client, if I requet to load object page, I donot need bring project info
  export class LoadAction implements Action {
    type = ActionTypes.LOAD;
      // load means that request to server, so no payload
    constructor(public payload: null) { }
  }
  
  export class LoadSuccessAction implements Action {
      type = ActionTypes.LOAD_SUCCESS;
      // if successful, it will load the project page including series of prjects
      constructor(public payload: Project[]) { }
  }
  
  export class LoadFailAction implements Action {
      type = ActionTypes.LOAD_FAIL;
      // if fail I prefer to get error message
      constructor(public payload: string) { }
  }

  // its little difference, it need to invite member to add this project, it need the projectId
  // and the the existing members array, 
  // 因为如果需要邀请组员，必须知道现有项目的的id,以及这些项目的现有成员列表
  export class InviteAction implements Action {
    type = ActionTypes.INVITE;
      
    constructor(public payload: {projectId: string, members: User[]}) { }
  }
  
  export class InviteSuccessAction implements Action {
      type = ActionTypes.INVITE_SUCCESS;
      // return the project type by action.payload, becauese It will include the new members list.
      constructor(public payload: Project) { }
  }
  
  export class InviteFailAction implements Action {
      type = ActionTypes.INVITE_FAIL;
      // if fail I prefer to get error message
      constructor(public payload: string) { }
  }
  
  export class SelectProjectAction implements Action {
    type = ActionTypes.SELECT_PROJECT;
    // means that it will bring one project in action.payload
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