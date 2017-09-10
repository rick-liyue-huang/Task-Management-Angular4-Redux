

// here 'store' is both the state origin and the one used for dispatch the actoion
// 'reduce' is the pure action, used for get the different actions and return the different state
// 'action' is info or event, which is deal by reducer and as well the store can get this action to get the new state

// the global reducer act like the database
// and each local reducer act like table 

import { NgModule } from '@angular/core';
import { StoreModule, combineReducers, ActionReducer } from '@ngrx/store';
import { RouterStoreModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// in the development environment, I will freeze the state. when the write the old state, it will error
import {storeFreeze} from 'ngrx-store-freeze';
import {compose} from '@ngrx/core/compose';
// used for caching the last action
import {createSelector} from 'reselect';
import {environment} from '../../environments/environment';

import * as fromQuote from './quote.reducer';
import * as fromAuth from './auth.reducer';
import * as fromProject from './project.reducer';
import * as fromTaskList from './task-list.reducer';
import * as fromTask from './task.reducer';
import * as fromUser from './user.reducer';
import {Auth} from '../domain';



// get the local state to create the whole State
export interface State {
     quote: fromQuote.State;
     auth: Auth;
     project: fromProject.State;
     taskLists: fromTaskList.State;
     tasks: fromTask.State;
     users: fromUser.State;
};

// get the local initial state to get the global initialstate
const initialState: State = {
    quote: fromQuote.initialState,
    auth: fromAuth.initialState,
    project: fromProject.initialState,
    taskLists: fromTaskList.initialState,
    tasks: fromTask.initialState,
    users: fromUser.initialState,
};

// get the local reducers to create the whole reducers
const reducers = {
    quote: fromQuote.reducer,
    auth: fromAuth.reducer,
    project: fromProject.reducer,
    taskLists: fromTaskList.reducer,
    tasks: fromTask.reducer,
    users: fromUser.reducer,
};

// combine the local reducers 
const productionReducers: ActionReducer<State> = combineReducers(reducers)
// for the development environment
const developmentReducers: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);

// reducer return the state
// get the last reducer
export function reducer(state = initialState, action: any ): State {
    
    // return environment.production 
    //     ? developmentReducers(state, action)
    //     : productionReducers(state, action);
    if (environment.production) {
        return productionReducers(state, action);
      } else {
        return developmentReducers(state, action);
      }
                        
}

// create method to get the quote reducer
export const getQuoteState = (state: State) => state.quote;
export const getAuthState = (state: State) => state.auth;
export const getProjectState = (state: State) => state.project;
export const getTaskListState = (state: State) => state.taskLists;
export const getTaskState = (state: State) => state.tasks;
export const getUserState = (state: State) => state.users;


// combine any two funcs, and create one rememable and cacheabl one
export const getQuote = createSelector(getQuoteState, fromQuote.getQuote);
export const getProjects = createSelector(getProjectState, fromProject.getAll);
export const getTaskLists = createSelector(getTaskListState, fromTaskList.getSelected);
export const getTasks = createSelector(getTaskState, fromTask.getTasks);
export const getUsers = createSelector(getUserState, fromUser.getUsers);

export const getUserEntities = createSelector(getUserState, fromUser.getEntities);
export const getTasksWithOwners = createSelector(getTasks, getUserEntities, (tasks, userEntities) => {
    // 对task map , 将task插入两个新的属性 owner and participants
    return tasks.map(task => {
        return {
            ...task, 
            owner: userEntities[task.ownerId],
            partiipants: task.participantIds.map(id => userEntities[id])
        }

    })
});

// 拿到一个任务列表中的所有task拿出来
export const getTasksByLists = createSelector(getTaskLists, getTasksWithOwners, (lists, tasks) => {
    return lists.map(list => {
        return {
            ...list,
            tasks: tasks.filter(task => task.taskListId === list.id)
        }
    })
});

export const getProjectUsers = (projectId: string) => createSelector(getProjectState, getUserEntities, (state, entities) => {
    return state.entities[projectId].members.map(id => entities[id]);
})


@NgModule({
    imports: [
        // here store module is the redux store, here 'reducer' is the global reducer
        StoreModule.provideStore(reducer),
        // ngrx for router state change
        RouterStoreModule.connectRouter(),
        // for chrome plugin
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
    ]
})
export class AppStoreModule {}