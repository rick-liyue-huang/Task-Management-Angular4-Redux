
import * as actions from '../actions/quote.action';
import {Quote} from '../domain/quote.model';

export interface State {
    quote: Quote
};

export const initialState: State = {
    quote: {
        cn: "我们在人生中会作出许多选择，带着这些选择继续生活，才是人生中最难的一课。《妙笔生花》",
        en: "We all make our choices in life. The hard thing to do is live with them.",
        pic: "/assets/img/quotes/6.jpg"
    }
};

// reducer is the pure function, it will receive two parameters: state and action
// and also return the state
// in other words, it return the old state and return the new state
// action has two properties: the action.type and action.payload, payload is the data brought.
// type is string.

// action.type has three typies, load: send the request, loadsuccess: response success,
// loadfail: response fail.


export function reducer(state = initialState, action: actions.Actions ): State {
    switch (action.type) {
        case actions.ActionTypes.LOAD_SUCCESS: {
             // return new class state
            return {...state, quote: <Quote>action.payload};
            // return Object.assign({}, state, {quote: action.payload});
        }
        case actions.ActionTypes.LOAD_FAIL:
        default: {
            return state;
        }
    }
}

// create the method to get the quote
export const getQuote = (state: State) => state.quote;