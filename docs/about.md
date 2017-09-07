
## The Details around this project

### Construct by Angular Material

#### Initial Layout

Creae the 'core' module, and 'app' import it, in the 'core'
create the components 'header', 'footer', and 'sidebar' components, let 'core' import them and export them, thus 'app' module will access these components.

familiar with flex layout
justify-conetent: flex-start; layout the items in horizontal direction.

align-content: flex-end; layout the items in vertical direction

align-items: center; // layout the items in one row line.

add '#sidenav' to refer to the target element.

```
<md-sidenav #sidenav mode="over" align="start">
    <app-sidebar></app-sidebar>
</md-sidenav>
```

style.scss need to import the material theme

```
@import '~@angular/material/prebuilt-themes/indigo-pink.css';
```

in 'core.module.ts' import 

```
import { MdToolbarModule } from '@angular/material';
```

and then, 

in the sub component use its component

```
<md-toolbar color="primary"></md-toolbar>
```

if want to put the element center position

```
.fill-remaining-space {
    flex: 1 1 auto;
}
```

#### Transmit the data(method) from one component to parent one.

firstly, define the method needed to emmit

```
@Output() toggle = new EventEmitter<void>();
```

and then let the target element (its parent element) receive it.

```
<app-header (toggle)="sidenav.toggle()"></app-header>

```

#### Create the self-defined icon font

Here I also use icon font from 'iconfont.com', so I need to import the needed svg file to '/assets'
directory. 

and I create one 'utils/svg.util.ts' utility files, in which to make the util functions

```
import { MdIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

export const loadSvgResources = (ir: MdIconRegistry, ds: DomSanitizer) => {
    ir.addSvgIcon('menu', ds.bypassSecurityTrustResourceUrl('assets/menu.svg'));
}
```

and other files will import it, here I let 'core.module.ts' import it.

```
constructor(@Optional() @SkipSelf() parent: CoreModule, 
                                      ir: MdIconRegistry,
                                      ds: DomSanitizer) {
    if (parent) {
      throw Error('module existed, cannot load again');
    }
    loadSvgResources(ir, ds);
  }
```
at last, header.component.ts will use it 

```
<md-icon svgIcon="menu"></md-icon>
```

#### Distach the routing files in different modules

firstly, create the '/shared' module to import and export the shared modules such as 'MdToolbarModule,MdIconModule, MdButtonModule, MdCardModule, MdInputModule', thus many modules can just import this 'shared' moduel.
secondly, create the '/login' module and component, used to complete the login page.
thirdly, create the 'login-routing.module.ts' and 'app-routing.module.ts' to match the respectively module.ts. and then let the 'app.module.ts' import the 'login.module.ts'.

#### Modify the Login page by md-card tag

here, just be familiar with the 'md-card' constructure.

#### Create the sidebar

here, I use md-nav-list to create sidebar, and use the foreach function to show the realtime date on the md-icon, which are imported from '/utils/svg.util.ts'.

#### Create the self-define material theme

create the '/theme.scss' define my theme.

```

@import '~@angular/material/theming';

@include mat-core();


// define the light theme
$my-app-primary: mat-palette($mat-indigo);
$my-app-accent: mat-palette($mat-pink, A200, A100, A100);
$my-app-warn: mat-palette($mat-red);

$my-app-theme: mat-light-theme($my-app-primary, $my-app-accent, $my-app-warn);

@include angular-material-theme($my-app-theme);


// define the dark theme
$my-dark-primary: mat-palette($mat-blue-grey);
$my-dark-accent: mat-palette($mat-amber, A200, A100, A100);
$my-dark-warn: mat-palette($mat-orange);

$my-dark-theme: mat-light-theme($my-dark-primary, $my-dark-accent, $my-dark-warn);

.myapp-dark-theme {
    @include angular-material-theme($my-dark-theme);
}
```

here I define two theme, and assign the second one to classname'myapp-dark-theme'.

provide 
```
<md-sidenav-container [class.myapp-dark-theme]="darkTheme">
```
to let the whole project switch each other. Here also notice the data transimit from child 'header' component to parent 'app' component by EventEmmiter().

#### Create the md-grid-list in 'register' page

here I define the 'avatars' array in 'svg.util.ts', and let the register 'md-grid-tile' component import it.

```
...
const avatarDir = `${imgDir}/avatar`;
ir.addSvgIconSetInNamespace('avatars', ds.bypassSecurityTrustResourceUrl(`${avatarDir}/avatars.svg`));
...
```
in 'register.component.html'

```
<md-grid-list cols="4" rowHeight="1:1">
    <!-- <md-grid-tile colspan="2">1</md-grid-tile> -->
    <!-- <md-grid-tile rowspan="2">5</md-grid-tile> -->
    <md-grid-tile *ngFor="let item of items">
        <md-icon class="avatar" [svgIcon]="item"></md-icon>
    </md-grid-tile>
</md-grid-list>
```

#### Deal with the MdDialog tag in 'project' module

Create the project directory, and realize the data transition between 'project-list' and 'new-project' component.

Firstly, declare the 'new-project' component and import in 'entryComponents' in 'project.module.ts'. it is special for md-dialog

```
entryComponents: [
    NewProjectComponent, 
    InviteComponent
  ]
```

in the 'porject-list' component, I send the data by

```
......
import {MdDialog} from '@angular/material';
......

constructor(private dialog: MdDialog) { }
......

openNewProjectDialog() {
    const dialogRef =  this.dialog.open(NewProjectComponent, {
      width: '800px',
      height: '300px', 
      position: {left: '0', top: '0'},
      data: {dark: true }
    });
``` 

and then in 'new-project' component, it will receive the data

```
import {MD_DIALOG_DATA, MdDialogRef, OverlayContainer} from '@angular/material';
......

constructor(@Inject(MD_DIALOG_DATA) private data, 
              private dialogRef: MdDialogRef<NewProjectComponent>,
              private oc: OverlayContainer) { }
 ......

 onClick() {
    this.dialogRef.close('I received your data');
  }
  .....             
```

if I want to send the message back to the 'project-list' component, I will get it in 'project-list' component

```
dialogRef.afterClosed().subscribe(result => console.log(result));
```

#### Create 'Invite' component by 'MdAutocompleteModule' 

When I search some member, just auto spread the member list by 'md-autocomplete' tag in 'invite' component, here input match with md-autocomplete tag by '#autoMembers'

```
<md-input-container class="full-width">
    <input mdInput type="text" placeholder="member name" [mdAutocomplete]="autoMembers">
</md-input-container>
.....

<md-autocomplete #autoMembers="mdAutocomplete" [displayWith]="displayUser">
  <md-option *ngFor="let item of items" [value]="item">
    {{item.name}}
  </md-option>
</md-autocomplete>
.....
```

Notice that, the 'invite' button is in 'project-item' component, but I hope to let the project-list component deal with the event logic, so I emit the invite click event to 'project-list' component.

firstly , define 'onInviteClick' method in 'project-item; component

```
 <button md-button type="button" (click)="onInviteClick()">
    <md-icon>group_add</md-icon>
    <span>Invite</span>
</button>
``` 

and declare the method 

```
@Output() onInvite = new EventEmitter<void>();
......

onInviteClick() {
    this.onInvite.emit();
    }
```

the method 'onInvite' will emit to 'project-list' component

```
<app-project-item *ngFor="let project of projects" 
                  [item]="project" 
                  class="card"
                  (onInvite)="OpenInviteDialog()"> 
```

at last, it will execute the method 'OpenInviteDialog' in 'project-list' component

```
OpenInviteDialog() {
    const dialogRef = this.dialog.open(InviteComponent);
  }
```

I just let the 'project-list' as the smart component, which deal with the event logic, and the dump 'project-item' component execute the pure click event.

#### Create the Task module and components

Same as the upon coding, I create 'task.module.ts' and '/task/task.components', and add the routing file to match the 'app-routing.module.ts'.

in the 'task-home.component.ts', the app-task-list contains the two for loops

```
 <app-task-list *ngFor="let list of lists" class="list-container">
    <app-task-header [header]="list.name"></app-task-header>
    <app-task-item *ngFor="let task of list.tasks">

    </app-task-item>
</app-task-list>
```

while in the 'task-list.component.ts', the task-list only contain 'ng-content' tag

```
<md-list>
  <ng-content></ng-content>
</md-list>
```

#### Modify the 'task-item' component

Here I use the ngClass to match the data property

```
...
[ngClass]="{
                    'priority-normal': item.priority === 3,
                    'priority-important': item.priority === 2,
                    'priority-emergency': item.priority === 1}"
...
```

and filter some data by pipe and *ngIf

```
<span class="due-date" *ngIf="item.dueDate">
      {{item.dueDate | date: "dd/MM/yy"}}
    </span>
```

#### Create the new-task component

firstly, I use [mdDatepicker] to bind the button with 'md-datepicker' tag.

```
...
<md-input-container class="full-width">
      <input mdInput [mdDatepicker]="remainderDatepicker" type="text" placeholder="task remainder date">
      <button type="button" mdSuffix [mdDatepickerToggle]="remainderDatepicker"></button>
</md-input-container>

<md-datepicker #remainderDatepicker></md-datepicker>
...
```

and then transmit the data from 'task-header' component to 'task-home' component, and let the latter one execute the 'openNewTaskDialog' method to open 'new-task' dialog. Here notice, `entryComponents: [NewTaskComponent]`, 'NewTaskComponent' is dialog component, so should put in entryComponents.


#### Create copy-task component

First one, I use dialog to receive the data

```
...
constructor(@Inject(MD_DIALOG_DATA) private data, private dialogRef: MdDialogRef<CopyTaskComponent>) { }
...
```
Second one, transfer the event from 'task-header' component to 'task-home' component, and let 'task-home' component transfer the data by

```
openCopyTaskDialog() {
    const dialogRef = this.dialog.open(CopyTaskComponent, {data: {lists: this.lists}});
  }
```

#### Create the shared 'confirm-dialog' component

I create the confirm-dialog componnet in the '/shared' directory, and let other different components import it.

and similar as the upon codes, I create the 'new-task-list' component, and let the smart component to execute the logic event.


### Add angular animation module to this projects

In order to realize the components animation style, I add the '@angular/animations' to this project.

#### Add animation with 'project-item' component and 'task-item' component.


firstly, create the 'card.animatioin.ts' and 'item.animation.ts' file in directory of 'animate',

```
import {trigger, state, transition, style, animate, keyframes} from '@angular/animations';
export const itemAnimation = trigger('item', [
    state('hover', style({'border-left-width': '8px'})),
    state('out', style({'border-left-width': '3px'})),
    transition('out => hover', animate('100ms ease-in')),
    transition('hover => out', animate('100ms ease-out'))
]);
```
and 

```
import {trigger, state, transition, style, animate, keyframes} from '@angular/animations';
export const cardAnimation = trigger('card', [
    state('out', style({transform: 'scale(1)', 'border-shadow': 'none'})),
    state('hover', style({transform: 'scale(1.2)', 'border-shadow': '3px 3px 5px 5px #ccc'})),
    transition('out => hover', animate('100ms ease-in')),
    transition('hover => out', animate('100ms ease-out'))
]);
```
and then in the 'project-item.component.ts'

```
import {cardAnimation} from '../../animate/card.animte';
 animations: [
    cardAnimation
  ]
  ...
  @HostBinding('@card') cardState = 'out'; 
  ...

  @HostListener('mouseenter')
  onMouseEnter() {
    this.cardState = 'hover';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.cardState = 'out';
  }
```

and do nothing in the 'project-item.component.html' file. 

here I use `@HostBinding('@card') cardState = 'out'; `, because the animation style will effect on the whole component, but not the part of it.

while, for the 'task-item' component, I only want to let the left border change width, so I don not '@HostBinding('@card') cardState = 'out'; ', but need add code `[@item]="widerPriority"` in 'task-item.component.html'.

and in 'task-item.component.ts'

```
import {itemAnimation} from '../../animate/item.animation';
...

animations: [
    itemAnimation
  ]
....

@HostListener('mouseenter')
  onMouseEnter() {
  this.widerPriority = 'hover';
}

@HostListener('mouseleave')
    onMouseLeave() {
    this.widerPriority = 'out';
}

  ....

```

#### Add routing animation

I create the 'router.animate.ts' animationg file

```
    state('void', style({'position': 'fixed', 'width': '100%', 'height': '80%'})),
    state('*', style({'position': 'fixed', 'width': '100%', 'height': '80%'})),

    // :enter
    transition('void => *', [
        style({transform: 'translateX(-100%)', opacity: 0}),
        // animate('.5s ease-in-out', style({transform: 'translateX(0)'}))

        //  let one group animation execute together
        group([
            animate('.5s ease-in-out', style({transform: 'translateX(0)'})),
            animate('.3s ease-in', style({opacity: 1}))
        ])
    ]),

    // :leave
    transition('* => void', [
        style({transform: 'translateX(0)', opacity: 1}),
        // animate('.5s ease-in-out', style({transform: 'translateX(100%)'}))
        group([
            animate('.5s ease-in-out', style({transform: 'translateX(100%)'})),
            animate('.3s ease-in', style({opacity: 0}))
        ])
    ])
]);
```

this is used frequently, and notice that, the ':enter' and ':leave' animation has some fixed rule.

and the whole page use router.animate.ts, so must use 

```
...
import {routingAnimation} from '../../animate/router.animate';
...
animations: [
    routingAnimation
  ]
  ...
@HostBinding('@routeAnim') state;
```

in the 'task-home.component.ts' and 'project-list.component.ts' files


#### Use 'query' and 'stagger' on list.animate

If use 'query' method, must define the parent elements, which bind with it.

```
<div class="container" [@list]="projects.length" >
 <app-project-item *ngFor="let project of projects" 
    ...
  </app-project-item>
</div>
```

here '<div class="container">' includes some sub elements. 

in 'list.animate.ts'

```
export const listAnimation = trigger('list', [

    // query the child element, if the query sub element doesnot exist, it needs optional
    transition('* => *', [
        query(':enter', style({opacity: 0}), {optional: true}),
        query(':enter', stagger(300, [
            animate('1s', style({opacity: 1}))
        ]), {optional: true}),

        query(':leave', style({opacity: 1}), {optional: true}),
        query(':leave', stagger(300, [
            animate('1s', style({opacity: 0}))
        ]), {optional: true})
    ])
    
]);
```
'query' method is binding with the 'app-project-item' tags, so the 'list.animate.ts' animation will effect on these sub elements.


### Modify the whole project

I will continue to modify the whole project,

#### Add DI and changeDetection

in the 'core.module.ts', add the providers (DI), and let others inject it

```
providers: [

    // this singleton mode
    {provide: 'BASE_CONFIG', useValue: 'http://localhost:3000'}
  ]
```

and the 'app.component.ts' constructor func will inject it

```
...
constructor(private oc: OverlayContainer, @Inject('BASE_CONFIG') config) {
console.log(config);
...
```

And then, in order to change the 'changeDetection' strategy, I import the 'ChangeDetectionStrategy' in all the dump components, and import 'ChangeDetectionStrategy' and 'ChangeDetectorRef' in all the smart components.

in dump components, 

```
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
...
changeDetection: ChangeDetectionStrategy.OnPush
...
```

in smart components,

```
import { Component, OnInit, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
...
changeDetection: ChangeDetectionStrategy.OnPush,
...

constructor(private dialog: MdDialog, private cd: ChangeDetectorRef) { }
...

// just check this branch
this.cd.markForCheck();
 ...
```

#### Create attribute drag and drop directive and service

Firstly, it provides the service 'drag-drop.service.ts' to let the directives import.

```
export interface DragData {
    ......
}

@Injectable()
export class DragDropService {
    .....
}

``` 

Secondly, in the 'drag.directive.ts', I output some properties: `selector: '[app-draggable][draggedClass][dragTag][dragData]'`, and the 'task-item' will add these attributes 

```
...
[app-draggable]="true"
[draggedClass]="'drag-start'"
[dragTag]="'task-item'"
[dragData]="item"
......
```

Similarly, in the 'drop.directive.ts', I output some properties: `selector: '[app-droppable][dropTags][dragEnterClass]'`, and the 'task-home' component will add these attributes

```
......
app-droppable
[dropTags]="['task-item', 'task-list']"
[app-draggable]="true"
[dragTag]="'task-list'"
[draggedClass]="'drag-start'"
[dragData]="list"
[dragEnterClass]="'drag-enter'"
(dropped)="handleMove($event, list)"
......
```

The purpose of directive is to let the target component (element) add some attributes.


#### Switch the task-list by [ngStyle]

Using [ngStyle] to switch the element property

in 'task-home' html file,

```
......
[ngStyle]="{'order': list.order}">
......
```

in 'task-home' ts file

```
handleMove(srcData, list) {
switch (srcData.tag) {
    case 'task-item': 
        console.log('handling item');
        break;
    case 'task-list':
        console.log('handle list');
        const srcList = srcData.data;
        const tempOrder = srcList.order;
        srcList.order = list.order;
        list.order = tempOrder;
        break;
    default:
        break;
    }
}
```


#### Create 'quick-task' by template driven form

create template form

```
<md-input-container class="full-width">
  <input mdInput type="text" placeholder="create new task quickly" [(ngModel)]="desc">
  <button mdSuffix md-icon-button type="button" (click)="sendQuickTask()"><md-icon>send</md-icon></button>
</md-input-container>

```
and use [(ngModel)] to bind the data.

#### Modify the 'login' html form by model driven form

firstly, add formgroup and ngsubmit on the form, and bind the formControlName with input tag,

```
...
<form [formGroup]="loginForm" (ngSubmit)="onSubmit(loginForm, $event)">
...

formControlName="email"
......
```

and then, I can use 'formgroup' or 'formbuilder' to bind this form in 'longin.component.ts',

```
...
this.loginForm = new FormGroup({

    // formControl to bind 'formControlName'
    email: new FormControl('rick@gmail.com', Validators.compose([Validators.required, Validators.email])),
    password: new FormControl('', Validators.required)
});
...

this.loginForm = this.fb.group({
    email: ['rick@rick.gmail', Validators.compose([Validators.required, Validators.email, this.validate])],
    password: ['', Validators.required]
});
...

```

of course, I also can create self-defined Validator by

```
validate(fc: FormControl): {[key: string]: any} {
    if (!fc.value) {
        return null;
    }

    const pattern = /^rick+/;
    if (pattern.test(fc.value)) {
        return null;
    }
    return {
        // bind {{loginForm.controls['email'].errors | json }}
        emailNotValid: 'the email must be valid'
    }
}
```

The model driven form used to deal with some complex form.

#### Create the self-defined form 'image-list-select' component, and let other forms use it.

I create the self-defined form, and import it in 'register' form

```
......

<app-image-list-select
        [useSvgIcon]="true"
        [cols]="6"
        [title]="'Choose Icon'"
        [items]="items"
        formControlName="avatar"></app-image-list-select>
.....
```

Thus let the 'register' form on focus on the own business.


### Add Rxjs on the Project

In order to complete some event in event stream type, I add the rxjs libs

#### Automatically update the login quotes

Here, I firstly create the mock data in 'mock/data.json', and run `json-server ./mock/data.json` to start the mock server, and then run create the Quote type model in 'domain/user.model.ts', create the 'services/quote.service.ts' to produce the 'QuoteService' Objservable.

```
@Injectable()
export class QuoteService {

    constructor(private http: Http, @Inject('BASE_CONFIG') private config) {}

    getQuote(): Observable<Quote> {

        const uri = `${this.config.uri}/quotes/${Math.floor(Math.random()*10).toFixed(0)}`;

        // the 'this.http.get(uri)' is Observable type, need to transfer to json type
        return this.http.get(uri).map(res => res.json() as Quote);
    }
}
```

At last, in 'login.component.ts' file, I inject the QuoteService and assign the quote Observable to 'this.quote',

```
...
constructor(
    private fb: FormBuilder,

    // this is a event stream
    private quoteService$: QuoteService) {

      // it will get the Quote type Observable
      this.quoteService$
        .getQuote()
        // and then assign the event stream to this.quote
        .subscribe(q => this.quote = q);
     }
     ...
```

and let the 'login.component.html' use {{quote.en}} and quote.pic.


#### Create debug util in  the 'debug.util.ts' 

In order to create debug method on quote service, I create the debug method in Observable propotype

```
.....

Observable.prototype.debug = function(message: string) {
    return this.do(
        (next) => {
            if (!environment.production) {
                console.log(message, next);
            }
        },

        (err) => {
            if (!environment.production) {
                console.error('ERROR>>', message, err);
            }
        },

        () => {
            if (!environment.production) {
                console.log('completed');
            }
        }
    )
}
......

```

and use 'debug' in 'quota.service.ts'

```
.....
getQuote(): Observable<Quote> {

        const uri = `${this.config.uri}/quotes/${Math.floor(Math.random()*10).toFixed(0)}`;

        // the 'this.http.get(uri)' is Observable type, need to transfer to json type
        return this.http.get(uri)
            .debug('quote:')
            .map(res => res.json() as Quote);
    }
......
```

#### Create the project.service

Firstly, I code the 'project.service.ts' to create the 'ProjectService' in Observable type, 

```
......

@Injectable()
export class ProjectService {

    private readonly domain = 'projects';

    // for the post method
    private headers = new Headers({
        'Content-Type': 'application/json'
    });

    constructor(private http: Http, @Inject('BASE_CONFIG') private config) { }
    add(project: Project): Observable<Project> {
        .....
    }

    update(project: Project): Observable<Project> {
       ......
    }

    del(project: Project): Observable<Project> {
       ......
    }

    get (userId: string): Observable<Project[]> {
        ......
    }
}
```

and then let the 'project-list.ts' to inject this service, and get the projects array

```
......
ngOnInit() {
    this.service$.get("1").subscribe(projects => {
      this.projects = projects;

      // if get the data from server end, must do dirty value check. because it use the 
      this.cd.markForCheck();
    });
    
  }
  ......
```

#### Import the project service on the project-list component

```
openNewProjectDialog() {

    const selectedImg = `/assets/img/covers/${Math.floor(Math.random() * 40)}_tn.jpg`;

    // open the newProjectComponent and send data to the new component
    const dialogRef = this.diaglog.open(
      NewProjectComponent, 
      {data: {thumbnails: this.getThumbnails(), img: selectedImg}});

    // the dislogref will receive the data from another one.
    dialogRef.afterClosed()

    // just need one, donot need unsubscribe
      .take(1)
    // confirm here has value
      .filter(n => n)
      // for the add service, I also need to subscribe
      .map(val => ({...val, coverImg: this.buildImgSrc(val.coverImg)}))

      // for each stream, I use add method to create project.
      .switchMap(v => this.service$.add(v))
      // .subscribe(project => console.log(project));
      .subscribe(project => {
        // add this project on array.
        this.projects = [...this.projects, project];

        // must dirty value check.
        this.cd.markForCheck();
      });
  }
```

OpenUpdateDialog, OpenConfirmDialog have the similar redefined.


#### Create the user service and auth service

Based on the user.model and auth.model, I consider the service how to deal with user and authenuser.

Here I need that each project has multiple members and each user also can have multiple projectIds.

in the 'user.service' file, I realize some methods, searchUsers, getUsersbyProject, addProjectRef, removeProjectRef, and batchUpdateProjectRef.

```
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
       ......
    }
    getUsersbyProject(projectId: string): Observable<User[]> {
        ......
    }
    addProjectRef(user: User, projectId: string): Observable<User> {
        ......
    }

    removeProjectRef(user: User, projectId: string): Observable<User> {
        ......
    }

    batchUpdateProjectRef(project: Project): Observable<User[]> {
        ......
    }

```

and as well in the 'auth.service'

```
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
        ......
    }

    // defien login method
    login(username: string, password: string ): Observable<Auth> {
        ......
    } 
```
upon file will add the register and login methods

#### Create the chips-list shared component and import to invite

Create the shared component 'chips-list', use mdAutocomplete tag to bind the input with list, and set the 
input type property which is input from 'invite' component.

#### Create the identity-input and area-list shared components

I use Subject to create the event stream in the both component, and realize the component.

in the 'area-list' component

```
......
  _province = new Subject();
  _city = new Subject();
  _district = new Subject();
  _street = new Subject();
  ......

 const province$ = this._province.asObservable().startWith('');
 const city$ = this._city.asObservable().startWith('');
 const district$ = this._district.asObservable().startWith('');
 const street$ = this._street.asObservable().startWith('');
 ......

 writeValue(obj: Address): void {
    if (obj) {
      this._address = obj;
    }
    if (this._address.province) {
      this._province.next(this._address.province);
    }
    if (this._address.city) {
      this._city.next(this._address.city);
    }
    if (this._address.district) {
      this._district.next(this._address.district);
    }
    if (this._address.street) {
      this._street.next(this._address.street);
    }
  }
  ....
```

and then import them in the 'register' component

```
<md-tab label="Personal Information">
    <div class="full-width">
        <app-identity-input formControlName="identity"></app-identity-input>
    </div>
    <div class="full-width">
        <app-age-input formControlName="dateOfBirth"></app-age-input>
    </div>
    <div class="full-width">
        <app-area-list formControlName="address"></app-area-list>
    </div>
</md-tab>

```

### Add Redux

We have to remember that: 
here 'store' is both the state origin and the one used for dispatch the actoion.
'reduce' is the pure action, used for get the different actions and return the different state.
'action' is info or event, which is deal by reducer and as well the store can get this action to get the new state

I create the reducer and action folders, which are store the actions and reducer files. 

In the 'reducers' folder, the quote.reducer file will deal with quote state and actioin, 'index.ts' is the global reducer and import the 'quote.reducer.ts', and also export the 'store'.

Based on the upon two folders, I modify the login.component.ts file by redux.

```
constructor(
    private fb: FormBuilder,

    // this is a event stream, QuoteService is '@Injectable()'.
    private quoteService$: QuoteService,
    private store$: Store<fromRoot.State>) {
      
      //22.  store$ can emit the action and also get the state, and will get the new state
      // this.quote$ = this.store$.select(state => state.quote.quote);
      this.quote$ = this.store$.select(fromRoot.getQuote);

      // it will get the Quote type Observable
      this.quoteService$
        .getQuote()
        // // and then assign the event stream to this.quote
        // .subscribe(q => this.quote = q);
        .subscribe(q => {
          
          //11. when action is successful, it transfer the info, it will get the new state --- q
          // this.store$.dispatch({type: actions.QUOTE_SUCCESS, payload: q})
          this.store$.dispatch(new actions.LoadSuccessAction(q));
          
          // notice: use reducer will lead to not control the state directly, but control the action under defined.
        });
        
     }
```

here, quote$ will effect the login quote part state.

#### add effects to update login.component

reducer is used for dealing with the state change among UIs, while the effects is used for dealing with the states between UI and outside(server), so I use effect to deal with the 'LOAD' method, which is request data from server.

```
// effect is one type of Action stream
    // 1. listen the action$ stream
    @Effect()
    // used for filtering the action type
    // 2. get 'LOAD' action
    quote$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.LOAD)
        // deal with this stream.
        .map(toPayload)
        // get the service method to get quote
        // 在处理完一种逻辑后，轻松地转到另外的逻辑上去 ： 获得数据流，然后通过map对另外的逻辑进行操作。
        .switchMap(_ => this.service$.getQuote()
        //  if success, load the success action
        .map(q => new actions.LoadSuccessAction(q))
        // if fail, load the fail action
        .catch(err => Observable.of(new actions.LoadFailAction(JSON.stringify(err))))
    );
```

here the quote$ is Observable type and it is firslty gotten by the LOAD from server, and then map to the other methods 'LOADSUCCESS' and 'LOADFAIL'.

So, in the 'login.component' I only execute the 

```
// have to dispatch the 'load' method to load the quote from outside in the intial statge
      this.store$.dispatch(new actions.LoadAction(null));
```

to call 'LOAD' action to get the quote, the rest is done by the quote.effect.

#### update the header.component

To link the header with auth,
```
......

  auth$: Observable<Auth>;

  constructor(private store$: Store<fromRoot.State>) {
    this.auth$ = this.store$.select(getAuthState);
  }
  ......
```

#### modify the project-list by reducer and effects

Reducer deal with the state, different action return the different state, here mainly get the state from server, and merge/switch mor concat the state from server and local one, and here reducer affect by action.

Effects cannot change the memory (UI internal) state, but DO interact with server. Here such as update, add, delete and load, but after these methods, the update success/fail, load success/fail, delete success/fail or add success/ fail will execute in the reducer file. Effects also listen the actions, and call the service logic which is defined in project.service. The purpose of effects is to combine(compose) these logic business.

So in the ui component file, it only care what data I will emmit, and which state I get from store.

for example, in the 'project.reducer', it only deal with the delete_success action

```
......
case actions.ActionTypes.DELETE_SUCCESS: {
            return delProject(state, action);
}
......
```
and in the 'project.effects.ts', it will deal with the delet action, and also combine the delete_success action in 'project.reducer.ts'

```
......
@Effect()
    deleteProject$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.DELETE)
        .map(toPayload)
        .switchMap((project) => this.service$.del(project)
        //  if success, load the success action
        // it will return the auth type
        
        .map(projects => new actions.DeleteSuccessAction(projects))
        // if fail, load the fail action
        // it will return error
        
        .catch(err => Observable.of(new actions.DeleteFailAction(JSON.stringify(err))))
    );
 ......   
``` 

while these actions methods defined in the 'project.action.ts'.

so, in the 'project-list' component, it only call store and dispatch the actions, but need not care the details of reducer and effect.

```
......
dialogRef.afterClosed()
    // just delete one
      .take(1)
      .filter(n => n)
      .subscribe(_ => {
        this.store$.dispatch(new actions.DeleteAction(project))
    });
......
```


















