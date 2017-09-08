
/* 1. ... in project.reducer.ts
2. effects cannot change the memory (UI internal) state, but DO interact with server 
here such as update, add, delete and load, but after these methods, the update success/fail, load success/fail,
delete success/fail or add success/ fail will execute in the reducer file.

Effects also listen the actions, and call the service logic which is defined in project.service.
The purpose of effects is to combine(compose) these logic business.

3... in project-list.component.ts
*/


// effect is another reducer, I hope to deal with the effect and reducer by the action stream
import { Injectable } from '@angular/core';
import {Actions, toPayload, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action, Store} from '@ngrx/store';
import {go} from '@ngrx/router-store';
import * as actions from '../actions/project.action';
import * as taskListActions from '../actions/task-list.action';
import {AuthService} from '../services/auth.service';
import {ProjectService} from '../services/project.service';
import {User} from '../domain';
import * as fromRoot from '../reducers';

@Injectable()
export class ProjectEffets {
    
    
    // effect is one type of Action stream
    // 1. listen the action$ stream
    @Effect()
    loadProject$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.LOAD)
        // deal with this stream.
        .map(toPayload)
        // have to get the current user id, because only can get the user's project
        // 必须找到当前用户参与的项目，所以需要store$ 来获得user信息

        // 得到当前用户的认证状态
        .withLatestFrom(this.store$.select(fromRoot.getAuthState))

        // 在处理完一种逻辑后，轻松地转到另外的逻辑上去 ： 获得数据流，然后通过map对另外的逻辑进行操作。
        // 这时候将得到两个信息，_是payload， 我们不用关心，另外一个是auth是上面的步骤来的，我们要得到他的auth id
        .switchMap(([_, auth]) => this.service$.get(auth.userId)
        //  if success, load the success action
        // it will return the auth type
        // 如果成功了，就带一个project
        .map(projects => new actions.LoadSuccessAction(projects))
        // if fail, load the fail action
        // it will return error
        // 否则就是发送一个错误信息
        .catch(err => Observable.of(new actions.LoadFailAction(JSON.stringify(err))))
    );

    @Effect()
    addProject$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.ADD) // listen the ADD action

        .map(toPayload) //notice the payload
        .withLatestFrom(this.store$.select(fromRoot.getAuthState))
        // here I have to care the payload, so can not use "_", but the action.payload = project  
        .switchMap(([project, auth]) => {
            // 展开project添加一个members, 这样auth就变为project的成员之一
            const added = {...project, members: [`${auth.userId}`]};
            // 然后将这个新的成员加入到service里面
            return this.service$.add(added)
            // 返回一个project
            .map(project => new actions.AddSuccessAction(project))
            .catch(err => Observable.of(new actions.AddFailAction(JSON.stringify(err))))
        }
    );
    
    @Effect()
    updateProject$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.UPDATE)
        .map(toPayload)
        .switchMap((project) => this.service$.update(project)
        //  if success, load the success action
        // it will return the auth type
        // 如果成功了，就带一个project
        .map(projects => new actions.UpdateSuccessAction(projects))
        // if fail, load the fail action
        // it will return error
        // 否则就是发送一个错误信息
        .catch(err => Observable.of(new actions.UpdateFailAction(JSON.stringify(err))))
    );
    
    @Effect()
    deleteProject$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.DELETE)
        .map(toPayload)
        .switchMap((project) => this.service$.del(project)
        //  if success, load the success action
        // it will return the auth type
        // 如果成功了，就带一个project
        .map(projects => new actions.DeleteSuccessAction(projects))
        // if fail, load the fail action
        // it will return error
        // 否则就是发送一个错误信息
        .catch(err => Observable.of(new actions.DeleteFailAction(JSON.stringify(err))))
    );

    @Effect()
    selectProject$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.SELECT_PROJECT)
        .map(toPayload) // deal with the payload(project)
        // deal with this stream.
        .map(project => go([`/tasklists/${project.id}`])); // route to the tasklist under project id
    // notice that: the effects stream will effect the reducer stream.


    @Effect()
    loadTaskLists$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.SELECT_PROJECT)
        .map(toPayload) 
        .map(project => new taskListActions.LoadAction(project.id)); // route to the tasklist under project id
    // notice that: the effects stream will effect the reducer stream.
    
    @Effect()
    invite$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.INVITE)
        .map(toPayload)  // match payload: {projectId: string, members: User[]}
        .switchMap(({projectId, members}) => this.service$.invite(projectId, members)
        //  if success, load the success action
        // it will return the auth type
        // 如果成功了，就带一个project
        .map(project => new actions.InviteSuccessAction(project))
        // if fail, load the fail action
        // it will return error
        // 否则就是发送一个错误信息
        .catch(err => Observable.of(new actions.InviteFailAction(JSON.stringify(err))))
    );

    constructor(
        private actions$: Actions, 
        private service$: ProjectService, 
        private store$: Store<fromRoot.State>
    ) {}
}