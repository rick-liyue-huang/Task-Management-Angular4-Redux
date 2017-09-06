
// I use Auth from domain as state.
import * as actions from '../actions/auth.action';
import {Auth} from '../domain';

export const initialState: Auth = {};

export function reducer(state = initialState, action: actions.Actions ): Auth {
    switch (action.type) {
        case actions.ActionTypes.LOGIN_SUCCESS:
        case actions.ActionTypes.REGISTER_SUCCESS: {
            return {
                // return new class state
                 ...<Auth>action.payload };
        }

        case actions.ActionTypes.LOGIN_FAIL:
        case actions.ActionTypes.REGISTER_FAIL: {
            return initialState;
        }

        default: {
            return state;
        }
    }
}