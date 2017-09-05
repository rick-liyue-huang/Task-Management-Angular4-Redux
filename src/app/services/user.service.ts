

import { Injectable, Inject } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {User, Project} from '../domain';
import {Observable} from 'rxjs/Observable';

// it means that it can be inject in the constructor func
@Injectable()
export class UserService {

    private readonly domain = 'users';

    // for the post method
    private headers = new Headers({
        'Content-Type': 'application/json'
    });

    // this DI is defined 
    constructor(private http: Http, @Inject('BASE_CONFIG') private config) { }

    // get the user by email
    searchUsers(filter: string): Observable<User[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http.get(uri, {params: {'email_like': filter}})
      .map(res => res.json() as User[]);
    }

    // get the user by project id
    getUsersbyProject(projectId: string): Observable<User[]> {
        const uri = `${this.config.uri}/${this.domain}`;
        return this.http
            .get(uri, {params: {'projectId': projectId}})
            .map(res => res.json() as User[]);
    }

    // add the project under the existed user id
    addProjectRef(user: User, projectId: string): Observable<User> {

        const uri = `${this.config.uri}/${this.domain}/${user.id}`;
        const projectIds = user.projectIds ? user.projectIds : [];

        if (projectIds.indexOf(projectId) > -1) {
            // if existed, return the existed user
            return Observable.of(user);
        }

        return this.http
            .patch(uri, JSON.stringify({projectIds: [...projectIds, projectId]}), {headers: this.headers})
            .map(res => res.json() as User);
    }

    // remove the project under the existed user id
    removeProjectRef(user: User, projectId: string): Observable<User> {
        
        const uri = `${this.config.uri}/${this.domain}/${user.id}`;
        const projectIds = user.projectIds ? user.projectIds : [];
        const index = projectIds.indexOf(projectId);

        if (index === -1) {
            // if the project index does not exist, return the original one.
            return Observable.of(user);
        }
        const toUpdate = [...projectIds.slice(0, index), ...projectIds.slice(index + 1)];
        return this.http
            .patch(uri, JSON.stringify({projectIds: toUpdate}), {headers: this.headers})
            .map(res => res.json() as User);
    }

    //  batch add the users for the project (update the project.members)
    batchUpdateProjectRef(project: Project): Observable<User[]> {

        const projectId = project.id;
        // if hasnot members, it will return empty array
        const memberIds = project.members ? project.members : [];

             // turn the projects members array to stream
        return Observable.from(memberIds)
            // get the  member id (Observable user) in the members array, and then swithmap to the normal user
            .switchMap(id => {
                const uri = `${this.config.uri}/${this.domain}/${id}`;
                return this.http.get(uri).map(res => res.json() as User);
            }) // it will get all the user from this project
            // 
            .filter(user => user.projectIds.indexOf(projectId) === -1)
            // add the user to this project.
            .switchMap(u => this.addProjectRef(u, projectId))
            // turn the series of stream to array.
            .reduce((arr, curr) => [...arr, curr], []);
    }


}