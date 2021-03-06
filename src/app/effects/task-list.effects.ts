
// effect is another reducer, I hope to deal with the effect and reducer by the action stream
import { Injectable } from '@angular/core';
import {Actions, toPayload, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action, Store} from '@ngrx/store';
import {go} from '@ngrx/router-store';
import * as actions from '../actions/task-list.action';
import * as taskActions from '../actions/task.action';
import {TaskListService} from '../services/task-list.service';
import {User} from '../domain';
import * as fromRoot from '../reducers';

@Injectable()
export class TaskListEffets {
    
    
    // effect is one type of Action stream
    // 1. listen the action$ stream
    @Effect()
    loadTaskList$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.LOAD)
        // deal with this stream.
        .map(toPayload)

        // 在处理完一种逻辑后，轻松地转到另外的逻辑上去 ： 获得数据流，然后通过map对另外的逻辑进行操作。
        // 这时候将得到两个信息，_是payload， 我们不用关心，另外一个是auth是上面的步骤来的，我们要得到他的auth id
        .switchMap((projectId) => this.service$.get(projectId)
        //  if success, load the success action
        // if success, get the tasklists array
            .map(taskLists => new actions.LoadSuccessAction(taskLists))
        // if fail, load the fail action
        // it will return error
        // 否则就是发送一个错误信息
            .catch(err => Observable.of(new actions.LoadFailAction(JSON.stringify(err))))
    );

    @Effect()
    addTaskList$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.ADD) // listen the ADD action
        .map(toPayload) //notice the payload 
        .switchMap((taskList) => this.service$.add(taskList)
        .map(tl => new actions.AddSuccessAction(tl))
        .catch(err => Observable.of(new actions.AddFailAction(JSON.stringify(err))))
    );
    
    @Effect()
    updateTaskList$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.UPDATE)
        .map(toPayload)
        .switchMap((taskList) => this.service$.update(taskList)
        //  if success, load the success action
        // it will return the auth type
        // 如果成功了，就带一个project
        .map(tl => new actions.UpdateSuccessAction(tl))
        // if fail, load the fail action
        // it will return error
        // 否则就是发送一个错误信息
        .catch(err => Observable.of(new actions.UpdateFailAction(JSON.stringify(err))))
    );
    
    @Effect()
    deleteTaskList$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.DELETE)
        .map(toPayload)
        .switchMap((taskList) => this.service$.del(taskList)
        .map(tl => new actions.DeleteSuccessAction(tl))
        // if fail, load the fail action
        // it will return error
        // 否则就是发送一个错误信息
        .catch(err => Observable.of(new actions.DeleteFailAction(JSON.stringify(err))))
    );

    @Effect()
    swap$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.SWAP)
        .map(toPayload) // deal with the payload(project)
        .switchMap(({src, target}) => this.service$.swapOrder(src, target)
            .map(taskLists => new actions.SwapSuccessAction(taskLists))
            .catch(err => Observable.of(new actions.SwapFailAction(JSON.stringify(err))))
    );

    @Effect()
    loadTaskInList$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.LOAD_SUCCESS)
    .map(toPayload) // deal with the payload(project)
    .map(lists => new taskActions.LoadAction(lists));
    
    constructor(
        private actions$: Actions, 
        private service$: TaskListService, 
        private store$: Store<fromRoot.State>
    ) {}
}