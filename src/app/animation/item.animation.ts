

import {trigger, state, style, animate, transition, keyframes} from '@angular/animations';

// itemAnimation used to bind with animations: [itemAnimation]
// item used to bind the state, [@item]=xxx
export const itemAnimation = trigger('item', [
    state('in', style({'border-left-width': '8px'})),
    state('out', style({'border-left-width': '3px'})),
    transition('in => out', animate('100ms ease-in')),
    transition('out => in', animate('100ms ease-out'))
]);