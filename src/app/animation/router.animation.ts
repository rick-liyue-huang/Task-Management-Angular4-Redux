
import {trigger, state, transition, style, animate, keyframes, group, query, stagger} from '@angular/animations';

// setting the router animation with fixed usage.
export const routerAnimation = trigger('routerAnim', [
    state('void', style({'position': 'fixed', 'width': '100%', 'height': '80%'})),
    state('*', style({'position': 'fixed', 'width': '100%', 'height': '80%'})),
    // :enter
    transition('void => *', [
        style({transform: 'translateX(-100%)', opacity: 0}),
        // animate('.5s ease-in-out', style({transform: 'translateX(0)'}))
        group([
            animate('.5s ease-in-out', style({transform: 'translateX(0)'})),
            animate('.3s ease-in-out', style({opacity: 1}))
        ])
    ]),
    // :leave 
    transition('* => void', [
        style({transform: 'translateX(0)', opacity: 1}),
        group([
            animate('.5s ease-in-out', style({transform: 'translateX(100%)'})),
            animate('.3s ease-in-out', style({opacity: 0}))
        ])
        
    ])
]);

