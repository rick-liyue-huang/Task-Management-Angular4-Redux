

// reducer can listen all the actions
// 这里的task.reducer包括了所有的tasklist层面的状态信息

import * as actions from '../actions/task.action';
import * as projectActions from '../actions/project.action';
import {Task, Project} from '../domain';
import * as _ from 'lodash';
import {createSelector} from 'reselect';

export interface State {
    ids: string[];
    entities: { [id: string]: Task };
};

export const initialState: State = {
    ids: [],
    entities: {}
};

const addTask = (state, action) => {
    const task = action.payload;
    // if the existed entities include the project(payload), it return the old state
    if (state.entities[task.id]) {
        return state;
    }
    // 将原来的数组展开，放入新的元素，返回新的数组
    const newIds = [...state.ids, task.id];
    // 将原来的字典的对象打散，加入新的对象，然后得到新的字典， 字典就是key:object
    const newEntities = {...state.entities, [task.id]: task};
    // return the new state including the new ids and new entities
    return {ids: newIds, entities: newEntities};
}

const updateTask  = (state, action) => {
    const task = action.payload;
    const newEntities = {...state.entities, [task.id]: task};
    return {...state, entities: newEntities};

}

const delTask = (state, action) => {
    const task = action.payload;
    const newIds = state.ids.filter(id => id !== task.id);
    const newEntities = newIds.reduce((entities, id: string) => ({...entities, [id]: state.entities[id]}), {});
    return {
        ids: newIds,
        entities: newEntities
    };
}

const loadTasks = (state, action) => {
    const tasks = action.payload;
    const incomingIds = tasks.map(tl => tl.id);
    const newIds = _.difference(incomingIds, state.ids);
    // transfer to entity
    const incomingEntities = _.chain(tasks)
        .keyBy('id')
        .mapValues(o => o)
        .value();
    const newEntities = newIds.reduce((entities, id:string) => ({...entities, [id]:incomingEntities[id]}), {});
    return {
        ids: [...state.ids,...newIds],
        entities: {...state.entities, ...newEntities}
    };
}

const moveAllTasks = (state, action) => {
    const tasks = <Task[]>action.payload;
    const updateEntities = tasks.reduce((entities, task) => ({...entities, [task.id]: task}), {});
    return {
        ...state,
        entities: {...state.entities, ...updateEntities}
    }
}

// will delete all the tasks under the paylod project
const deleteTasksByProject = (state, action) => {
    const project = <Project>action.payload;
    const taskListIds = project.taskLists;
    // 所谓的删除就是将不同的留下来，相同的去掉
    // just leave the different ones
    const remainingIds =state.ids.filter(id => taskListIds.indexOf(state.entities[id].taskListId) === -1)
    // 从数组 到 对象， 用reduce构造字典对象
    // by reduce, get the id of remainingIds, and construct the entities by the id: entity
    const remainingEntities = remainingIds.reduce((entities, id) => ({...entities, [id]: state.entities[id]}), {});
    // get the new state
    return {
        ids: [...remainingIds], // this is the new id array
        entities: remainingEntities
    };    
}

export function reducer(state = initialState, action: actions.Actions ): State {
    switch (action.type) {
        case actions.ActionTypes.ADD_SUCCESS: {
            return addTask(state, action);
        }
        case actions.ActionTypes.DELETE_SUCCESS: {
            return delTask(state, action);
        }
        case actions.ActionTypes.COMPLETE_SUCCESS:
        case actions.ActionTypes.MOVE_SUCCESS:
        case actions.ActionTypes.UPDATE_SUCCESS: {
            return updateTask(state, action);
        }
        case actions.ActionTypes.LOAD_SUCCESS: {
            return loadTasks(state, action);
        }
        case actions.ActionTypes.MOVE_ALL_SUCCESS: {
            return moveAllTasks(state, action);
        }

        // or want to delete the project to delete all the tasks under this project
        case projectActions.ActionTypes.DELETE_SUCCESS: {
            return deleteTasksByProject(state, action);
        }

        default: {
            return state;
        }
    }
}

export const getIds = (state: State) => state.ids;
export const getEntities = (state: State) => state.entities;

export const getTasks = createSelector(getIds, getEntities, (ids, entities) => {

    // get the project element array.
    return ids.map(id => entities[id]);
})