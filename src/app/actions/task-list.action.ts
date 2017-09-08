



import { Action } from '@ngrx/store';
import { type } from '../utils/type.util';
import {Project, TaskList} from '../domain';

export const ActionTypes = {
  ADD:                 type('[TaskList] Add'),
  ADD_SUCCESS:         type('[TaskList] Add_Success'),
  ADD_FAIL:            type('[TaskList] Add_Fail'),
  UPDATE:              type('[TaskList] Update'),
  UPDATE_SUCCESS:      type('[TaskList] Update_Success'),
  UPDATE_FAIL:         type('[TaskList] Update_Fail'),
  DELETE:              type('[TaskList] Delete'),
  DELETE_SUCCESS:      type('[TaskList] Delete_Success'),
  DELETE_FAIL:         type('[TaskList] Delete_Fail'),
  LOAD:                type('[TaskList] Load'),
  LOAD_SUCCESS:        type('[TaskList] Load_Success'),
  LOAD_FAIL:           type('[TaskList] Load_Fail'),
  SWAP:                type('[TaskList] Swap'),
  SWAP_SUCCESS:        type('[TaskList] Swap_Success'),
  SWAP_FAIL:           type('[TaskList] Swap_Fail')
};


export class AddAction implements Action {
  type = ActionTypes.ADD;
    // load means that request to server, so no payload
    // when login I should return the email and password 
  constructor(public payload: TaskList) { }
}

export class AddSuccessAction implements Action {
    type = ActionTypes.ADD_SUCCESS;
    // when successful it will return auth
    constructor(public payload: TaskList) { }
}

export class AddFailAction implements Action {
    type = ActionTypes.ADD_FAIL;
    // if fail I prefer to get error message
    constructor(public payload: string) { }
}

export class UpdateAction implements Action {
    type = ActionTypes.UPDATE;
      // load means that request to server, so no payload
    constructor(public payload: TaskList) { }
  }
  
  export class UpdateSuccessAction implements Action {
      type = ActionTypes.UPDATE_SUCCESS;
  
      constructor(public payload: TaskList) { }
  }
  
  export class UpdateFailAction implements Action {
      type = ActionTypes.UPDATE_FAIL;
      // if fail I prefer to get error message
      constructor(public payload: string) { }
  }

  export class DeleteAction implements Action {
    type = ActionTypes.DELETE;
      // load means that request to server, so no payload
    constructor(public payload: TaskList) { }
  }
  
  export class DeleteSuccessAction implements Action {
      type = ActionTypes.DELETE_SUCCESS;
  
      constructor(public payload: TaskList) { }
  }
  
  export class DeleteFailAction implements Action {
      type = ActionTypes.DELETE_FAIL;
      // if fail I prefer to get error message
      constructor(public payload: string) { }
  }

  export class LoadAction implements Action {
    type = ActionTypes.LOAD;
      // load means that it reuest the tasklist under the project, project.tasklist taskLists?: string[];
    constructor(public payload: string) { }
  }
  
  export class LoadSuccessAction implements Action {
      type = ActionTypes.LOAD_SUCCESS;
  
      constructor(public payload: TaskList[]) { }
  }
  
  export class LoadFailAction implements Action {
      type = ActionTypes.LOAD_FAIL;
      // if fail I prefer to get error message
      constructor(public payload: string) { }
  }

//   will swap the source with target
  export class SwapAction implements Action {
    type = ActionTypes.SWAP;
    // action bring the source tasklist and tagert target tasklist
    constructor(public payload: {src: TaskList, target: TaskList}) { }
  }
  
//   when successful, it will return the both array, so is tasklist array
  export class SwapSuccessAction implements Action {
      type = ActionTypes.SWAP_SUCCESS;
      // if successful, it bring the tasklists array
      constructor(public payload: TaskList[]) { }
  }
  
  export class SwapFailAction implements Action {
      type = ActionTypes.SWAP_FAIL;
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
    | SwapAction | SwapSuccessAction | SwapFailAction;

    