
import * as actions from '../actions/quote.action';
import {Quote} from '../domain';

export interface State {
    quote: Quote;
};

export const initialState: State = {
    quote: {
        cn: "我们在人生中会作出许多选择，带着这些选择继续生活，才是人生中最难的一课。《妙笔生花》",
        en: "We all make our choices in life. The hard thing to do is live with them.",
        pic: "/assets/img/quotes/6.jpg"
      }
};

export function reducer(state: State = initialState, action: actions.Actions ): State {
    
    // state will return the new state by the different action
    switch (action.type) {
        // action.type is string
        case actions.ActionTypes.LOAD_SUCCESS: {
            // return new class state, do not change the old one ,just add the new one
            return {...state, quote: <Quote>action.payload };
            // return Object.assign({}, state, {quote: action.payload});
        }
        case actions.ActionTypes.LOAD_FAIL: 
        default: {
            // return the original state
            return state;
        }
    }
}

export const getQuote = (state: State) => state.quote;