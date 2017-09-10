

// effect is another reducer, I hope to deal with the effect and reducer by the action stream
import { Injectable } from '@angular/core';
import {Actions, toPayload, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action, Store} from '@ngrx/store';
import {go} from '@ngrx/router-store';
import * as actions from '../actions/task.action';
import {TaskService} from '../services/task.service';
import {User} from '../domain';
import * as fromRoot from '../reducers';

@Injectable()
export class TaskEffets {
    
    
    // effect is one type of Action stream
    // 1. listen the action$ stream
    @Effect()
    loadTask$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.LOAD)
        // deal with this stream.
        .map(toPayload)

        // 在处理完一种逻辑后，轻松地转到另外的逻辑上去 ： 获得数据流，然后通过map对另外的逻辑进行操作。
        // 这时候将得到两个信息，_是payload， 我们不用关心，另外一个是auth是上面的步骤来的，我们要得到他的auth id
        .switchMap((taskLists) => this.service$.getByLists(taskLists)
        //  if success, load the success action
        // if success, get the tasks array
            .map(tasks => new actions.LoadSuccessAction(tasks))
        // if fail, load the fail action
        // it will return error
        // 否则就是发送一个错误信息
            .catch(err => Observable.of(new actions.LoadFailAction(JSON.stringify(err))))
    );

    @Effect()
    addTask$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.ADD) // listen the ADD action
        .map(toPayload) //notice the payload 
        .switchMap((task) => this.service$.add(task)
        .map(t => new actions.AddSuccessAction(t))
        .catch(err => Observable.of(new actions.AddFailAction(JSON.stringify(err))))
    );
    
    @Effect()
    updateTask$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.UPDATE)
        .map(toPayload)
        .switchMap((task) => this.service$.update(task)
        //  if success, load the success action
        // it will return the auth type
        // 如果成功了，就带一个project
        .map(t => new actions.UpdateSuccessAction(t))
        // if fail, load the fail action
        // it will return error
        // 否则就是发送一个错误信息
        .catch(err => Observable.of(new actions.UpdateFailAction(JSON.stringify(err))))
    );
    
    @Effect()
    deleteTask$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.DELETE)
        .map(toPayload)
        .switchMap((task) => this.service$.del(task)
        .map(t => new actions.DeleteSuccessAction(t))
        // if fail, load the fail action
        // it will return error
        // 否则就是发送一个错误信息
        .catch(err => Observable.of(new actions.DeleteFailAction(JSON.stringify(err))))
    );

    @Effect()
    complete$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.COMPLETE)
        .map(toPayload)
        .switchMap((task) => this.service$.complete(task)
        .map(t => new actions.CompleteSuccessAction(t))
        // if fail, load the fail action
        // it will return error
        // 否则就是发送一个错误信息
        .catch(err => Observable.of(new actions.CompleteFailAction(JSON.stringify(err))))
    );

    @Effect()
    move$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.MOVE)
        .map(toPayload) // deal with the payload(project)
        .switchMap(({taskId, taskListId}) => this.service$.move(taskId, taskListId)
            .map(task => new actions.MoveSuccessAction(task))
            .catch(err => Observable.of(new actions.MoveFailAction(JSON.stringify(err))))
    );

    @Effect()
    moveAll$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.MOVE_ALL)
        .map(toPayload) // deal with the payload(project)
        .switchMap(({srcListId, targetListId}) => this.service$.moveAll(srcListId, targetListId)
            .map(tasks => new actions.MoveAllSuccessAction(tasks))
            .catch(err => Observable.of(new actions.MoveAllFailAction(JSON.stringify(err))))
    );
    
    constructor(
        private actions$: Actions, 
        private service$: TaskService, 
        private store$: Store<fromRoot.State>
    ) {}
}