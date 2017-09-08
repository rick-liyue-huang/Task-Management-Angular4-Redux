/* 1.  
project reducer deal with the state, different action return the different state, here mainly get the state from server, 
and merge/switch mor concat the state from server and local one.
here reducer affect by action

.... 2. in project.effects.ts
*/


import * as actions from '../actions/project.action';
import {Project} from '../domain';
import * as _ from 'lodash';  // better for array and object string transfer
import {createSelector} from 'reselect';

export interface State {
    // 这里的状态是在当前状态下，整个project页面里面显式的状态，包括ids：就是有多少个project，每个
    // id 对应一个project， 而selectedid是指选定的那个project的id。而entities是指id对应project的字典对象。
    ids: string[];
    entities: { [id: string]: Project };
    // record the selected project id. select one each time
    selectedId: string | null;
};

export const initialState: State = {
    ids: [],
    entities: {},
    selectedId: null,
};

const addProject = (state, action) => {
    // this project is the action bringing one.
    const project = action.payload;
    // if the existed entities include the project(payload), it return the old state
    if (state.entities[project.id]) {
        // 对现有状态不做修改，只是返回原有的。
        return state;
    }
    // 否则
    // 将原来的数组展开，放入新的元素，返回新的数组
    const ids = [...state.ids, project.id];
    // 将原来的字典的对象打散，加入新的对象，然后得到新的字典， 字典就是key:object
    const newEntities = {...state.entities, [project.id]: project};
    // 将原有的state打散，然后将新的id 和 字典放进去，得到新的状态
    // here the new state include new ids and new entities,
    return {...state, ids: ids, entities: newEntities};
}

const updateProject  = (state, action) => {
    // here the original state already includes the project, just update, so do not care id
    const project = action.payload;
    // dirctionay tpype is easier to update than array
    const newEntities = {...state.entities, [project.id]: project};
    return {...state, entities: newEntities};
}

const delProject = (state, action) => {
    const project = action.payload;
    // fiter return the new array.
    const newIds = state.ids.filter(id => id !== project.id);
    // reduce has two parameters, the func one and original object value, just construct the new entities by the newIds
    const newEntities = newIds.reduce((entities, id: string) => ({...entities, [id]: state.entities[id]}), {});
    // return the new state, including the new ones
    return {
        ids: newIds, // delete means that will delete the old ones and get the total new one
        entities: newEntities,
        selectedId: null
    };
}

// here I hope to load the new projects and also keep the old one, but donot want to clear old ones and load the total new.
const loadProjects = (state, action) => {

    //  notice: constructor(public payload: Project[]) { } in LoadSuccessAction action
    const projects = action.payload; // here is the project array by action.payload
    const incomingIds = projects.map(p => p.id); // transfer from projects array to id array

    // match the old ids with the new ids, get the real new ids
    const newIds = _.difference(incomingIds, state.ids);
    
    // transfer from projects array to entities
    const incomingEntities = _.chain(projects) // for this projects array
        .keyBy('id') // get the project id, and act as the key for the new entities object
        .mapValues(o => o) // act the project element in the project array as value of the entities
        .value(); // get the new enetitie

        //  [id]:incomingEntities[id] is {key:value}
    const newEntities = newIds.reduce((entities, id:string) => ({...entities, [id]:incomingEntities[id]}), {});
    return {
        ids: [...state.ids,...newIds], // to overlay the original data, 
        entities: {...state.entities, ...newEntities},
        selectedId: null

    };
}

// reducer used to deal with the UI state, so here only focus on the state after request from server successfully
export function reducer(state = initialState, action: actions.Actions ): State {
    switch (action.type) {
        case actions.ActionTypes.ADD_SUCCESS: {
            // here I define some method function,
            return addProject(state, action);
        }
        case actions.ActionTypes.DELETE_SUCCESS: {
            return delProject(state, action);
        }
        case actions.ActionTypes.INVITE_SUCCESS:
        case actions.ActionTypes.UPDATE_SUCCESS: {
            return updateProject(state, action);
        }
        case actions.ActionTypes.LOAD_SUCCESS: {
            return loadProjects(state, action);
        }

        case actions.ActionTypes.SELECT_PROJECT: {
            // action.payload is the project type, and will new state including the selected project
            return {...state, selectedId:(<Project>action.payload).id}
        }
        default: {
            return state;
        }
    }
}

// to get the element in State
export const getIds = (state: State) => state.ids;
export const getEntities = (state: State) => state.entities;
export const getSelectedId = (state: State) => state.selectedId;

// get all the projects and encapsulate to array.
export const getAll = createSelector(getIds, getEntities, (ids, entities) => {

    // get the project element array.
    return ids.map(id => entities[id]);
})