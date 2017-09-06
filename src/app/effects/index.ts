
import { NgModule } from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {QuoteEffets} from './quote.effects';
import {AuthEffets} from './auth.effects';

@NgModule({
    imports: [
        // import the quoteeffects
        EffectsModule.run(QuoteEffets),
        EffectsModule.run(AuthEffets)
    ]
})
export class AppEffectsModule {}