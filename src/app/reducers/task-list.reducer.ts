
// reducer can listen all the actions


import * as actions from '../actions/task-list.action';
import * as projectActions from '../actions/project.action';
import {TaskList, Project} from '../domain';
import * as _ from 'lodash';
import {createSelector} from 'reselect';

export interface State {
    ids: string[];
    entities: { [id: string]: TaskList };
    selectedIds: string[] | null;
};

export const initialState: State = {
    ids: [],
    entities: {},
    selectedIds: [],
};

const addTaskList = (state, action) => {
    const taskList = action.payload;
    // if the existed entities include the project(payload), it return the old state
    if (state.entities[taskList.id]) {
        return state;
    }
    // 将原来的数组展开，放入新的元素，返回新的数组
    const ids = [...state.ids, taskList.id];
    // 将原来的字典的对象打散，加入新的对象，然后得到新的字典， 字典就是key:object
    const newEntities = {...state.entities, [taskList.id]: taskList};
    // 将原有的state打散，然后将新的id 和 字典放进去，得到新的
    return {...state, ids: ids, entities: newEntities};
}

const updateTaskList  = (state, action) => {
    const taskList = action.payload;
    const newEntities = {...state.entities, [taskList.id]: taskList};
    return {...state, entities: newEntities};

}

const delTaskList = (state, action) => {
    const taskList = action.payload;
    const newIds = state.ids.filter(id => id !== taskList.id);
    const newEntities = newIds.reduce((entities, id: string) => ({...entities, [id]: state.entities[id]}), {});
    const newSelectedIds = state.selectedIds.filter(id => id !== taskList.id);
    return {
        ids: newIds,
        entities: newEntities,
        selectedIds: newSelectedIds
    };
}

const loadTaskList = (state, action) => {
    const taskLists = action.payload;
    const incomingIds = taskLists.map(p => p.id);
    const newIds = _.difference(incomingIds, state.ids);
    
    // transfer to entity
    const incomingEntities = _.chain(taskLists)
        .keyBy('id')
        .mapValues(o => o)
        .value();
    const newEntities = newIds.reduce((entities, id:string) => ({...entities, [id]:incomingEntities[id]}), {});
    return {
        ...state,
        ids: [...state.ids,...newIds],
        entities: {...state.entities, ...newEntities}
    };
}

const swapTaskLists = (state, action) => {
    // action.payload is the tasklist array
    const taskLists = <TaskList[]>action.payload;
    // here ids neednot change, just change entities
    // get the entity object
    const updateEntities = _.chain(taskLists)
        .keyBy('id')
        .mapValues(o => o)
        .value();
    // and then spread the entities
    const newEntities = {...state.entities, ...updateEntities};
    return {
        ...state, entities: newEntities
    }
}

const selectProject = (state, action) => {
    // here action bring 'project'
    const selected = <Project>action.payload;
    // here I filter the tasklist with projectId equal to selected.projectId
    const selectedIds = state.ids.filter(id => state.entities[id].projectId = selected.id);
    return {
        ...state, selectedIds: selectedIds
    }
}

const deleteListByProject = (state, action) => {
    const project = <Project>action.payload;
    const taskListIds = project.taskLists;
    // 所谓的删除就是将不同的留下来，相同的去掉
    const remainingIds = _.difference(state.ids, taskListIds);
    // 从数组 到 对象， 用reduce构造字典对象
    const remainingEntities = remainingIds.reduce((entities, id) => ({...entities, [id]: state.entities[id]}), {});
    // 重新生成写的对象
    return {
        ids: [...remainingIds],
        entities: remainingEntities,
        selectedIds: []
    };    
}

export function reducer(state = initialState, action: actions.Actions ): State {
    switch (action.type) {
        case actions.ActionTypes.ADD_SUCCESS: {
            return addTaskList(state, action);
        }
        case actions.ActionTypes.DELETE_SUCCESS: {
            return delTaskList(state, action);
        }
        case actions.ActionTypes.UPDATE_SUCCESS: {
            return updateTaskList(state, action);
        }
        case actions.ActionTypes.LOAD_SUCCESS: {
            return loadTaskList(state, action);
        }
        case actions.ActionTypes.SWAP_SUCCESS: {
            return swapTaskLists(state, action);
        }

        // sometime, I also need to select some project to get the different tasklist
        // reducer 可以监听所有的action, including the project actions
        case projectActions.ActionTypes.SELECT_PROJECT: {
            return selectProject(state, action);
        }

        // or want to delete the project to delete all the tasklist under this project
        case projectActions.ActionTypes.DELETE_SUCCESS: {
            return deleteListByProject(state, action);
        }

        default: {
            return state;
        }
    }
}

export const getIds = (state: State) => state.ids;
export const getEntities = (state: State) => state.entities;
export const getSelectedIds = (state: State) => state.selectedIds;

export const getSelected = createSelector(getIds, getEntities, (ids, entities) => {

    // get the project element array.
    return ids.map(id => entities[id]);
})