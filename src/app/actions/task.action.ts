
// similar as the tasklist action

import { Action } from '@ngrx/store';
import { type } from '../utils/type.util';
import {Project, Task, TaskList} from '../domain';

export const ActionTypes = {
  ADD:                 type('[Task] Add'),
  ADD_SUCCESS:         type('[Task] Add_Success'),
  ADD_FAIL:            type('[Task] Add_Fail'),
  UPDATE:              type('[Task] Update'),
  UPDATE_SUCCESS:      type('[Task] Update_Success'),
  UPDATE_FAIL:         type('[Task] Update_Fail'),
  DELETE:              type('[Task] Delete'),
  DELETE_SUCCESS:      type('[Task] Delete_Success'),
  DELETE_FAIL:         type('[Task] Delete_Fail'),
  LOAD:                type('[Task] Load'),
  LOAD_SUCCESS:        type('[Task] Load_Success'),
  LOAD_FAIL:           type('[Task] Load_Fail'),
  MOVE:                type('[Task] Move'),
  MOVE_SUCCESS:        type('[Task] Move_Success'),
  MOVE_FAIL:           type('[Task] Move_Fail'),
  MOVE_ALL:                type('[Task] Move_All'),
  MOVE_ALL_SUCCESS:        type('[Task] Move_All_Success'),
  MOVE_ALL_FAIL:           type('[Task] Move_All_Fail'),
  COMPLETE:                type('[Task] Complete'),
  COMPLETE_SUCCESS:        type('[Task] Complete_Success'),
  COMPLETE_FAIL:           type('[Task] Complete_Fail')

};


export class AddAction implements Action {
  type = ActionTypes.ADD;
    // load means that request to server, so no payload
    // when login I should return the email and password 
  constructor(public payload: Task) { }
}

export class AddSuccessAction implements Action {
    type = ActionTypes.ADD_SUCCESS;
    // payload is the task brought
    constructor(public payload: Task) { }
}

export class AddFailAction implements Action {
    type = ActionTypes.ADD_FAIL;
    // if fail I prefer to get error message
    constructor(public payload: string) { }
}

export class UpdateAction implements Action {
    type = ActionTypes.UPDATE;
      // load means that request to server, so no payload
    constructor(public payload: Task) { }
  }
  
  export class UpdateSuccessAction implements Action {
      type = ActionTypes.UPDATE_SUCCESS;
  
      constructor(public payload: Task) { }
  }
  
  export class UpdateFailAction implements Action {
      type = ActionTypes.UPDATE_FAIL;
      // if fail I prefer to get error message
      constructor(public payload: string) { }
  }

  export class DeleteAction implements Action {
    type = ActionTypes.DELETE;
      // load means that request to server, so no payload
    constructor(public payload: Task) { }
  }
  
  export class DeleteSuccessAction implements Action {
      type = ActionTypes.DELETE_SUCCESS;
  
      constructor(public payload: Task) { }
  }
  
  export class DeleteFailAction implements Action {
      type = ActionTypes.DELETE_FAIL;
      // if fail I prefer to get error message
      constructor(public payload: string) { }
  }

  export class LoadAction implements Action {
    type = ActionTypes.LOAD;
      // load means that it request the tasklist[] under the project, project.tasklist taskLists?: string[];
    constructor(public payload: TaskList[]) { }
  }
  
  export class LoadSuccessAction implements Action {
      type = ActionTypes.LOAD_SUCCESS;
  
      constructor(public payload: Task[]) { }
  }
  
  export class LoadFailAction implements Action {
      type = ActionTypes.LOAD_FAIL;
      // if fail I prefer to get error message
      constructor(public payload: string) { }
  }

//   will swap the source with target
  export class MoveAction implements Action {
    type = ActionTypes.MOVE;
    constructor(public payload: {srcId: string, taskListId: string}) { }
  }
  
//   when successful, it will return the both array, so is tasklist array
  export class MoveSuccessAction implements Action {
      type = ActionTypes.MOVE_SUCCESS;
      
      constructor(public payload: Task) { }
  }
  
  export class MoveFailAction implements Action {
      type = ActionTypes.MOVE_FAIL;
      // if fail I prefer to get error message
      constructor(public payload: string) { }
  }

  export class MoveAllAction implements Action {
    type = ActionTypes.MOVE_ALL;
    constructor(public payload: {srcListId: string, targetListId: string}) { }
  }
  
//   when successful, it will return the both array, so is tasklist array
  export class MoveAllSuccessAction implements Action {
      type = ActionTypes.MOVE_ALL_SUCCESS;
      // if successful, it bring the tasks array
      constructor(public payload: Task[]) { }
  }
  
  export class MoveAllFailAction implements Action {
      type = ActionTypes.MOVE_ALL_FAIL;
      // if fail I prefer to get error message
      constructor(public payload: string) { }
  }

  export class CompleteAction implements Action {
    type = ActionTypes.COMPLETE;
    // action bring the source tasklist and tagert target tasklist
    constructor(public payload: Task) { }
  }
  
//   when successful, it will return the both array, so is tasklist array
  export class CompleteSuccessAction implements Action {
      type = ActionTypes.COMPLETE_SUCCESS;
      // if successful, it bring the tasklists array
      constructor(public payload: Task) { }
  }
  
  export class CompleteFailAction implements Action {
      type = ActionTypes.COMPLETE_FAIL;
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
    | MoveAction | MoveSuccessAction | MoveFailAction
    | MoveAllAction | MoveAllSuccessAction | MoveAllFailAction 
    | CompleteAction | CompleteSuccessAction | CompleteFailAction;

    