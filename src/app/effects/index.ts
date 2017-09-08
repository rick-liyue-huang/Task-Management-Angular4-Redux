
import { NgModule } from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {QuoteEffets} from './quote.effects';
import {AuthEffets} from './auth.effects';
import {ProjectEffets} from './project.effects';
import {TaskListEffets} from './task-list.effects';

@NgModule({
    imports: [
        // import the quoteeffects
        EffectsModule.run(QuoteEffets),
        EffectsModule.run(AuthEffets),
        EffectsModule.run(ProjectEffets),
        EffectsModule.run(TaskListEffets)
    ]
})
export class AppEffectsModule {}