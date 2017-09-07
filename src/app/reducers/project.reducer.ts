/* 1.  
project reducer deal with the state, different action return the different state, here mainly get the state from server, 
and merge/switch mor concat the state from server and local one.
here reducer affect by action

.... 2. in project.effects.ts
*/


import * as actions from '../actions/project.action';
import {Project} from '../domain';
import * as _ from 'lodash';
import {createSelector} from 'reselect';

export interface State {
    ids: string[];
    entities: { [id: string]: Project };
    selectedId: string | null;
};

export const initialState: State = {
    ids: [],
    entities: {},
    selectedId: null,
};

const addProject = (state, action) => {
    const project = action.payload;
    // if the existed entities include the project(payload), it return the old state
    if (state.entities[project.id]) {
        return state;
    }
    // 将原来的数组展开，放入新的元素，返回新的数组
    const ids = [...state.ids, project.id];
    // 将原来的字典的对象打散，加入新的对象，然后得到新的字典， 字典就是key:object
    const newEntities = {...state.entities, [project.id]: project};
    // 将原有的state打散，然后将新的id 和 字典放进去，得到新的
    return {...state, ids: ids, entities: newEntities};
}

const updateProject  = (state, action) => {
    const project = action.payload;
    const newEntities = {...state.entities, [project.id]: project};
    return {...state, entities: newEntities};

}

const delProject = (state, action) => {
    const project = action.payload;
    const newIds = state.ids.filter(id => id !== project.id);
    const newEntities = newIds.reduce((entities, id: string) => ({...entities, [id]: state.entities[id]}), {});
    return {
        ids: newIds,
        entities: newEntities,
        selectedId: null
    };
}

const loadProject = (state, action) => {
    const projects = action.payload;
    const incomingIds = projects.map(p => p.id);
    const newIds = _.difference(incomingIds, state.ids);
    
    // transfer to entity
    const incomingEntities = _.chain(projects)
        .keyBy('id')
        .mapValues(o => o)
        .value();
    const newEntities = newIds.reduce((entities, id:string) => ({...entities, [id]:incomingEntities[id]}), {});
    return {
        ids: [...state.ids,...newIds],
        entities: {...state.entities, ...newEntities},
        selectedId: null

    };
}

export function reducer(state = initialState, action: actions.Actions ): State {
    switch (action.type) {
        case actions.ActionTypes.ADD_SUCCESS: {
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
            return loadProject(state, action);
        }

        case actions.ActionTypes.SELECT_PROJECT: {
            return {...state, selectedId:(<Project>action.payload).id}
        }
        

        default: {
            return state;
        }
    }
}

export const getIds = (state: State) => state.ids;
export const getEntities = (state: State) => state.entities;
export const getSelectedId = (state: State) => state.selectedId;

export const getAll = createSelector(getIds, getEntities, (ids, entities) => {

    // get the project element array.
    return ids.map(id => entities[id]);
})