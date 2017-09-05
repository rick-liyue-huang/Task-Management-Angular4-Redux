
import { Injectable, Inject } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Project} from '../domain';
import {Observable} from 'rxjs/Observable';

// it means that it can be inject in the constructor func
@Injectable()
export class ProjectService {

    private readonly domain = 'projects';

    // for the post method
    private headers = new Headers({
        'Content-Type': 'application/json'
    });

    // this DI is defined 
    constructor(private http: Http, @Inject('BASE_CONFIG') private config) { }

    // define the returned thing is the event stream (Observable type), so I can deal with these results as event stream
    add(project: Project): Observable<Project> {
        
        project.id = null;
        const uri = `${this.config.uri}/${this.domain}`;
        return this.http
            .post(uri, JSON.stringify(project), {headers: this.headers})
            // the received response data， and then map to json data
            .map(res => res.json());
    }

    // same as the add method 
    update(project: Project): Observable<Project> {
        
        const uri = `${this.config.uri}/${this.domain}/${project.id}`;
        const toUpdate = {
            name: project.name,
            desc: project.desc,
            coverImg: project.coverImg
        };
        return this.http
        // patch mesans to select some properties to update, is similar as put (used for update)
            .patch(uri, JSON.stringify(toUpdate), {headers: this.headers})
            .map(res => res.json());
    }

    // define the delete method
    del(project: Project): Observable<Project> {
        
        // define the event stream, from the tasklist array in this project
        // becaue the new project has not tasklist property
        const delTasks$ = Observable.from(project.taskLists ? project.taskLists : [])
        //  for each event stream (list), I delete the tasks in this listId by 
        // mergeMap means that delete all the substreams from merged outside streams
        // json server will delete all the tasks in the tasklist
        // and will return the array
            .mergeMap(listId => this.http.delete(`${this.config.uri}/taskLists/${listId}`))
            //  confirm the event complete count.,
            .count(); // and just tell next, it finished. 

        return delTasks$
            // do not care the outside stream, 'delTask$' is the count , if the count confirmed, i just delete the project.
            .switchMap(_ => this.http.delete(`${this.config.uri}/${this.domain}/${project.id}`))
            // .map(_ => project);
            .mapTo(project);
    }

    //  only delete the project under dedicated user,
    get (userId: string): Observable<Project[]> {

        const uri = `${this.config.uri}/${this.domain}`;
        return this.http
            .get(uri, {params: {'members_like': userId}})
            .map(res => res.json() as Project[]);
    }
}