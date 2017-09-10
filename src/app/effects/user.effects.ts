

// effect is another reducer, I hope to deal with the effect and reducer by the action stream
import { Injectable } from '@angular/core';
import {Actions, toPayload, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action, Store} from '@ngrx/store';
import {go} from '@ngrx/router-store';
import * as actions from '../actions/user.action';
import {UserService} from '../services/user.service';
import {User} from '../domain';
import * as fromRoot from '../reducers';

@Injectable()
export class UserEffets {
    
    
    // effect is one type of Action stream
    // 1. listen the action$ stream
    @Effect()

    // 尽管loadUser 在这里执行，但是实在点击project的时候就应该触发的，因此需要在project.effects里面有一个触发这个方法的方法。
    loadUser$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.LOAD)
        // deal with this stream.
        .map(toPayload)

        // 在处理完一种逻辑后，轻松地转到另外的逻辑上去 ： 获得数据流，然后通过map对另外的逻辑进行操作。
        // 这时候将得到两个信息，_是payload， 我们不用关心，另外一个是auth是上面的步骤来的，我们要得到他的auth id
        .switchMap((projectId) => this.service$.getUsersbyProject(projectId)
        //  if success, load the success action
        // if success, get the tasklists array
            .map(users => new actions.LoadSuccessAction(users))
        // if fail, load the fail action
        // it will return error
        // 否则就是发送一个错误信息
            .catch(err => Observable.of(new actions.LoadFailAction(JSON.stringify(err))))
    );

    @Effect()
    addUserProjectRef$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.ADD) // listen the ADD action
        .map(toPayload) //notice the payload 
        .switchMap(({user, projectId}) => this.service$.addProjectRef(user, projectId)
        .map(u => new actions.AddSuccessAction(u))
        .catch(err => Observable.of(new actions.AddFailAction(JSON.stringify(err))))
    );
    
    @Effect()
    updateUserProjectRef$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.UPDATE)
        .map(toPayload)
        .switchMap((project) => this.service$.batchUpdateProjectRef(project)
        //  if success, load the success action
        // it will return the auth type
        // 如果成功了，就带一个project
        .map(users => new actions.UpdateSuccessAction(users))
        // if fail, load the fail action
        // it will return error
        // 否则就是发送一个错误信息
        .catch(err => Observable.of(new actions.UpdateFailAction(JSON.stringify(err))))
    );
    
    @Effect()
    deleteUserProjectRef$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.DELETE)
        .map(toPayload)
        .switchMap(({user, projectId}) => this.service$.removeProjectRef(user, projectId)

        // 进行下一步的时候要看上一步返回什么，比如这里上面返回user
        .map(user => new actions.DeleteSuccessAction(user))
        // if fail, load the fail action
        // it will return error
        // 否则就是发送一个错误信息
        .catch(err => Observable.of(new actions.DeleteFailAction(JSON.stringify(err))))
    );

    @Effect()
    search$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.SEARCH)
        .map(toPayload) // deal with the payload(project)
        .switchMap((str) => this.service$.searchUsers(str)
            .map(users => new actions.SearchSuccessAction(users))
            .catch(err => Observable.of(new actions.SearchFailAction(JSON.stringify(err))))
    );
    
    constructor(
        private actions$: Actions, 
        private service$: UserService, 
        private store$: Store<fromRoot.State>
    ) {}
}