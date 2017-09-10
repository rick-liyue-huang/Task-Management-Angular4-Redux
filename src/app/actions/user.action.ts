

// similar as the tasklist action

import { Action } from '@ngrx/store';
import { type } from '../utils/type.util';
import {Project, User, Task} from '../domain';

// define the relationship between user and project
export interface UserProject {
    user: User;
    projectId: string;
}

// forcus on the projectId under user object
export const ActionTypes = {
  ADD:                 type('[User] Add_User_Project'),
  ADD_SUCCESS:         type('[User] Add_User_Project_Success'),
  ADD_FAIL:            type('[User] Add_User_Project_Fail'),
  UPDATE:              type('[User] Update_User_Project'),
  UPDATE_SUCCESS:      type('[User] Update_User_Project_Success'),
  UPDATE_FAIL:         type('[User] Update_User_Project_Fail'),
  DELETE:              type('[User] Delete_User_Project'),
  DELETE_SUCCESS:      type('[User] Delete_User_Project_Success'),
  DELETE_FAIL:         type('[User] Delete_User_Project_Fail'),
  LOAD:                type('[User] Load_User_By_Project'),
  LOAD_SUCCESS:        type('[User] Load_User_By_Project_Success'),
  LOAD_FAIL:           type('[User] Load_User_By_Project_Fail'),
  SEARCH:                type('[User] Search'),
  SEARCH_SUCCESS:        type('[User] Search_Success'),
  SEARCH_FAIL:           type('[User] Search_Fail'),
  

};


export class AddAction implements Action {
  type = ActionTypes.ADD;
    // load means that request to server, so no payload
  constructor(public payload: UserProject) { }
}

export class AddSuccessAction implements Action {
    type = ActionTypes.ADD_SUCCESS;
    // payload is the task brought
    constructor(public payload: User) { }
}

export class AddFailAction implements Action {
    type = ActionTypes.ADD_FAIL;
    // if fail I prefer to get error message
    constructor(public payload: string) { }
}

//  update means that update the members under the project

export class UpdateAction implements Action {
    type = ActionTypes.UPDATE;
      // load means that it need the project type to confirm the members
    constructor(public payload: Project) { }
  }
  

export class UpdateSuccessAction implements Action {
      type = ActionTypes.UPDATE_SUCCESS;
//   if success it will return series of users
      constructor(public payload: User[]) { }
  }
  
export class UpdateFailAction implements Action {
      type = ActionTypes.UPDATE_FAIL;
      // if fail I prefer to get error message
      constructor(public payload: string) { }
  }
    
//   here Delete means to delete the relationship between user and project
  export class DeleteAction implements Action {
    type = ActionTypes.DELETE;
      // load means that request to server, so no payload
    constructor(public payload: UserProject) { }
  }
  
  export class DeleteSuccessAction implements Action {
      type = ActionTypes.DELETE_SUCCESS;
  
      constructor(public payload: User) { }
  }
  
  export class DeleteFailAction implements Action {
      type = ActionTypes.DELETE_FAIL;
      // if fail I prefer to get error message
      constructor(public payload: string) { }
  }

  export class LoadAction implements Action {
    type = ActionTypes.LOAD;
      // load means that it request the projectId
    constructor(public payload: string) { }
  }
  
  export class LoadSuccessAction implements Action {
      type = ActionTypes.LOAD_SUCCESS;
  
      constructor(public payload: User[]) { }
  }
  
  export class LoadFailAction implements Action {
      type = ActionTypes.LOAD_FAIL;
      // if fail I prefer to get error message
      constructor(public payload: string) { }
  }

//   will swap the source with target
  export class SearchAction implements Action {
    type = ActionTypes.SEARCH;
    // when search, need the keywords
    constructor(public payload: string) { }
  }
  
//   when successful, it will return the user array
  export class SearchSuccessAction implements Action {
      type = ActionTypes.SEARCH_SUCCESS;
      
      constructor(public payload: User[]) { }
  }
  
  export class SearchFailAction implements Action {
      type = ActionTypes.SEARCH_FAIL;
      // if fail I prefer to get error message
      constructor(public payload: string) { }
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
    | SearchAction | SearchSuccessAction | SearchFailAction;

    