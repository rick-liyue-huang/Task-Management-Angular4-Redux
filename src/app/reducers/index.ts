
import { NgModule } from '@angular/core';
import { StoreModule, combineReducers, ActionReducer } from '@ngrx/store';
import { RouterStoreModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {storeFreeze} from 'ngrx-store-freeze';
import {compose} from '@ngrx/core/compose';
import {createSelector} from 'reselect';
import {environment} from '../../environments/environment';

import * as fromQuote from './quote.reducer';


// this is the global state, it contains the branch states
export interface State {
    quote: fromQuote.State;
};

// define the initialstate in global 
const initialState: State = {
    quote: fromQuote.initialState
};

// used for import the reducers from outside as dictionary
const reducers = {
    quote: fromQuote.reducer
}

// combine to the global reducer
const productionReducers: ActionReducer<State> = combineReducers(reducers);

// avoid the original state changed 
const developmentReducers: ActionReducer<State> = compose(storeFreeze, combineReducers(reducers));

export function reducer(state = initialState, action: any ): State {
    // for production environment 
    return environment.production 
        ? productionReducers(state, action) : developmentReducers(state, action)
}

export const getQuoteState = (state: State) => state.quote;

export const getQuote = createSelector(getQuoteState, fromQuote.getQuote);

@NgModule({   
    imports: [
        StoreModule.provideStore(reducer),
        RouterStoreModule.connectRouter(),
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
    ]
})
export class AppStoreModule {}