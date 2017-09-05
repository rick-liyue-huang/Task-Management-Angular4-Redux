

import { Injectable, Inject } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Task} from '../domain';
import {Observable} from 'rxjs/Observable';
import {TaskList} from '../domain';

@Injectable()
export class TaskService {

    private readonly domain = 'tasks';

    // for the post method
    private headers = new Headers({
        'Content-Type': 'application/json'
    });
    constructor(private http: Http, @Inject('BASE_CONFIG') private config) { }

    // define the returned thing is the event stream (Observable type), so I can deal with these results as event stream
    add(task: Task): Observable<Task> {
        
        task.id = null;
        const uri = `${this.config.uri}/${this.domain}`;
        return this.http
            .post(uri, JSON.stringify(task), {headers: this.headers})
            // the received data
            .map(res => res.json());
    }

    // same as the add method
    update(task: Task): Observable<Task> {
        
        const uri = `${this.config.uri}/${this.domain}/${task.id}`;

        // define the 
        const toUpdate = {
            desc: task.desc,
            priority: task.priority,
            dueDate: task.dueDate,
            reminder: task.reminder,
            ownerId: task.ownerId,
            participantIds: task.participantIds,
            remark: task.remark
        };
        return this.http
        // patch mesans to select some properties to update
            .patch(uri, JSON.stringify(toUpdate), {headers: this.headers})
            .map(res => res.json());
    }

    del(task: Task): Observable<Task> {
        
        const uri = `${this.config.uri}/tasklists/${task.id}`
        
        return this.http.delete(uri)
            .mapTo(task);
    }

    //  only delete the project under dedicated user,
    get (tasklistId: string): Observable<Task[]> {

        const uri = `${this.config.uri}/${this.domain}`;
        return this.http
            .get(uri, {params: {'tasklistId': tasklistId}})
            // .map(res => res.json() as Project[]);   ?????
            .map(res => res.json() as Task[]);
    }


    //  get the tasks from project level
    getByLists(lists: TaskList[]): Observable<Task[]> {

        // get the list array 
        return Observable.from(lists)
            // get each list, through list id
            .mergeMap(list => this.get(list.id))
            //  for each list, I combine all the tasks in each list.
            .reduce((tasks: Task[], t: Task[]) => [...tasks, ...t], []);
    }


    //  change the task completed status
    complete(task: Task): Observable<Task> {
        
        const uri = `${this.config.uri}/${this.domain}/${task.id}`;

        return this.http
        .patch(uri, JSON.stringify({completed: !task.completed}), {headers: this.headers})
            .map(res => res.json());
    }

    // move the task to the target tasklist
    move(taskId: string, tasklistId: string): Observable<Task> {
        
        const uri = `${this.config.uri}/${this.domain}/${taskId}`;

        return this.http
        .patch(uri, JSON.stringify({tasklistId: tasklistId}), {headers: this.headers})
            .map(res => res.json());
    }

    // move the tasklist to another tasklist
    moveAll(srcListId: string, targetListId: string): Observable<Task[]> {
        
        // get all the tasks array from the source task list
        return this.get(srcListId)
            // turn from array to series of tasks streams
            .mergeMap(tasks => Observable.from(tasks))
            // for each task, move which to the target list
            .mergeMap(task => this.move(task.id, targetListId))
            // produce the new task array
            .reduce((arr, x) => [...arr, x], []);

    }
}