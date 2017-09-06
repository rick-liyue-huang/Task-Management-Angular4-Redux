
import { NgModule } from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {QuoteEffets} from './quote.effects';

@NgModule({
    imports: [
        // import the quoteeffects
        EffectsModule.run(QuoteEffets)
    ]
})
export class AppEffectsModule {}