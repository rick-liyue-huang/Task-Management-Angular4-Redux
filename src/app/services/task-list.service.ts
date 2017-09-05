

import { Injectable, Inject } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {TaskList} from '../domain';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class TaskListService {

    private readonly domain = 'taskLists';

    // for the post method
    private headers = new Headers({
        'Content-Type': 'application/json'
    });
    constructor(private http: Http, @Inject('BASE_CONFIG') private config) { }

    // define the returned thing is the event stream (Observable type), so I can deal with these results as event stream
    add(tasklist: TaskList): Observable<TaskList> {
        
        tasklist.id = null;
        const uri = `${this.config.uri}/${this.domain}`;
        return this.http
            .post(uri, JSON.stringify(tasklist), {headers: this.headers})
            // the received data
            .map(res => res.json());
    }

    // same as the add method
    update(tasklist: TaskList): Observable<TaskList> {
        
        const uri = `${this.config.uri}/${this.domain}/${tasklist.id}`;
        const toUpdate = {
            name: tasklist.name
        };
        return this.http
        // patch mesans to select some properties to update
            .patch(uri, JSON.stringify(toUpdate), {headers: this.headers})
            .map(res => res.json());
    }

    del(tasklist: TaskList): Observable<TaskList> {
        
        const uri = `${this.config.uri}/tasklists/${tasklist.id}`

        return this.http.delete(uri)
            .mapTo(tasklist);
    }

    //  only delete the project under dedicated user,
    get (projectId: string): Observable<TaskList[]> {

        const uri = `${this.config.uri}/${this.domain}`;
        return this.http
            .get(uri, {params: {'projectId': projectId}})
            // .map(res => res.json() as Project[]);   ?????
            .map(res => res.json() as TaskList[]);
    }

    // switch the lists order
    swapOrder1(src: TaskList, target: TaskList): Observable<TaskList[]> {

        // the srouce list uri
        const dragUri = `${this.config.uri}/${this.domain}/${src.id}`;

        // the target list uri
        const dropUri = `${this.config.uri}/${this.domain}/${target.id}`;

        const drag$ = this.http
            .patch(dragUri, JSON.stringify({order: target.order}), {headers: this.headers})
            .map(res => res.json());

        const drop$ = this.http
            .patch(dropUri, JSON.stringify({order: src.order}), {headers: this.headers})
            .map(res => res.json());

        return Observable
            // combine the two tasklist
            .concat(drag$, drop$)
            // produce the new tasklists array
            .reduce((arrs, list) => [...arrs, list], []);
    }

    
}