

// here 'store' is both the state origin and the one used for dispatch the actoion
// 'reduce' is the pure action, used for get the different actions and return the different state
// 'action' is info or event, which is deal by reducer and as well the store can get this action to get the new state

import { NgModule } from '@angular/core';
import { StoreModule, combineReducers, ActionReducer } from '@ngrx/store';
import { RouterStoreModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// in the development environment, I will freeze the state. when the write the old state, it will error
import {storeFreeze} from 'ngrx-store-freeze';
import {compose} from '@ngrx/core/compose';
// used for caching the last action
import {createSelector} from 'reselect';
import * as fromQuote from './quote.reducer';
import {environment} from '../../environments/environment';


// get the local state 
export interface State {
     quote: fromQuote.State;
};

// get the local initial state to get the global initialstate
const initialState: State = {
    quote: fromQuote.initialState,
};

// get the local reducer
const reducers = {
    quote: fromQuote.reducer,
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

// combine any two funcs, and create one rememable and cacheabl one
export const getQuote = createSelector(getQuoteState, fromQuote.getQuote);

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