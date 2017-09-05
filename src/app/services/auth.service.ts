

import { Injectable, Inject } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Auth, User} from '../domain';
import {Observable} from 'rxjs/Observable';

// it means that it can be inject in the constructor func
@Injectable()
export class AuthService {

    private readonly domain = 'users';
    private headers = new Headers({
        'Content-Type': 'application/json'
    });

    // based on the jwt json web token
    private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
    '.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9' +
    '.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';

    constructor(private http: Http, @Inject('BASE_CONFIG') private config) {}

    // register --- receive the user and return the auth
    register(user: User): Observable<Auth> {

        user.id = null;
        const uri = `${this.config.uri}/${this.domain}`;
        return this.http
        //  firstly use get method to get the email, email is th username
            .get(uri, {params: {'email': user.email}})
            .switchMap(res => {
                // return the array, which is the email results array
                // if >0 . means that get the emals
                if (res.json().length > 0) {
                    // so wrong
                    throw 'user existed'
                }
                // otherwise, it will post to register the new user to auth
                return this.http
                    .post(uri, JSON.stringify(user), {headers: this.headers})
                    // and get back the user with token
                    .map(r => ({token: this.token, user: r.json()}));
            })


    }

    // defien login method
    login(username: string, password: string ): Observable<Auth> {

        const uri = `${this.config.uri}/${this.domain}`;
        return this.http
            .get(uri, {params: {'email': username, 'password': password}})
            .map(res => {
                if (res.json()=== 0) {
                    throw 'username or password not match';
                }
                return {
                    token: this.token,
                    user: res.json()[0]
                };
            })

    } 
}