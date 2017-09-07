
// I use Auth from domain as state.
import * as actions from '../actions/auth.action';
import {Auth} from '../domain';

export const initialState: Auth = {};

export function reducer(state = initialState, action: actions.Actions ): Auth {
    switch (action.type) {
        case actions.ActionTypes.LOGIN_SUCCESS:
        case actions.ActionTypes.REGISTER_SUCCESS: {
            return {
                // from the auth.model.ts, login and register both return the auth type, so here 
                // return new auth type object (state)
                 ...<Auth>action.payload };
        }

        case actions.ActionTypes.LOGIN_FAIL:
        case actions.ActionTypes.REGISTER_FAIL: {
            // when fail return blank
            return initialState;
        }

        default: {
            return state;
        }
    }
}