
import {User} from './user.model';
import {Err} from './err.model';

export interface Auth {
    // token base
    user?: User;
    userId?: string;
    token?: string;
    err?: Err;
}