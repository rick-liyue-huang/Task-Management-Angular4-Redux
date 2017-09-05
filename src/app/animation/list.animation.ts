
import {trigger, transition, state, animate, group, style, keyframes, query, stagger} from '@angular/animations';

export const listAnimation = trigger('listAnim',[

    // * => * is the fixed usage for query animation, 
    // must add {optional: true}
    transition('* => *', [
        query(':enter', style({opacity: 0}), { optional: true }),
        query(':enter', stagger(200, [
            animate('1s', style({opacity: 1}))
        ]), { optional: true }),

        query(':leave', style({opacity: 1}), { optional: true }),
        query(':leave', stagger(200, [
            animate('1s', style({opacity: 0}))
        ]), { optional: true })
    ])
])