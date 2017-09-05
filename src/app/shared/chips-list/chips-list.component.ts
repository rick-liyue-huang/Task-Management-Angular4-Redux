
// this is the self-defined form
import { Component, OnInit, forwardRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { 
  ControlValueAccessor, 
  NG_VALUE_ACCESSOR, 
  NG_VALIDATORS, 
  FormControl, 
  FormBuilder, 
  FormGroup
} from '@angular/forms';

import {User} from '../../domain';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-chips-list',
  templateUrl: './chips-list.component.html',
  styleUrls: ['./chips-list.component.scss'],

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,

      // will wait until the 'ImageListSelectComponent' instance, and then DI
      useExisting: forwardRef(() => ChipsListComponent),
      // one for mult
      multi: true
    },
    {
      provide: NG_VALIDATORS,

      // will wait until the 'ImageListSelectComponent' instance, and then DI
      useExisting: forwardRef(() => ChipsListComponent),
      // one for mult
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ChipsListComponent implements OnInit, ControlValueAccessor {

  // confirm one tag or multiple tag (member)
  @Input() multiple = true;
  @Input() placeholderText = 'input member email';
  @Input() label = 'Add/Edit Member';

  chipsForm: FormGroup;
  items: User[] = [];
  memberResults$: Observable<User[]>;

  constructor(
    private fb: FormBuilder,
    // in order to use the user sevice methods, I inject service in constructor function
    private service: UserService) { }

  ngOnInit() {
    this.chipsForm = this.fb.group({
      memberSearch: ['']
    });

    // this.memberResults$ = this.searchUsers(this.chipsForm.controls['memberSearch'].valueChanges);
    
    // through series of input, I get the recommended values, and then 
    this.memberResults$ = this.chipsForm.get('memberSearch')
      // the value changed will lead to some event streams
      .valueChanges
      // avoid input too frequently
      .debounceTime(300)
      // avoid the repeated input
      .distinctUntilChanged()
      // only input two or more bytes, can emit the stream
      .filter(s => s && s.length > 1)
      // need to turn the str stream to the Observable user array
      .switchMap(str => this.service.searchUsers(str));


  }

  // 这里是做一个空函数体，真正使用的方法在 registerOnChange 中
  // 由框架注册，然后我们使用它把变化发回表单
  // 注意，和 EventEmitter 尽管很像，但发送回的对象不同
  private propagateChange = (_: any) => {};

 // setting the initial value
  writeValue(obj: User[]): void {

    // if has multple value
    if (obj && this.multiple) {
      // get the dictionary from array
      const userEntities = obj.reduce((entities, user) => {
        return {...entities, [user.id]: user};
      }, {});
      // if the maintain object users is not empty
      if (this.items) {
        
        const remaining = this.items.filter(item => !userEntities[item.id]);
        // will get the concat array 
        this.items = [...remaining, ...obj];
      }
    } else if (obj && !this.multiple) {
      this.items = [...obj];
    }
  }
  // 当表单控件值改变时，函数 fn 会被调用
  // 这也是我们把变化 emit 回表单的机制
  registerOnChange(fn: any): void {
      this.propagateChange = fn;
  }
  
  // 这里没有使用，用于注册 touched 状态
  registerOnTouched(fn: any): void {

  }
// 验证表单，验证结果正确返回 null 否则返回一个验证结果对象
  validate(c: FormControl): {[key: string]: any} {
    return this.items ? null : {
      chipListInvalid: {
        valid: false
      }
    };
  }

  removeMember(member: User) {
    // map to id array from users array
    const ids = this.items.map(item => item.id);

    // confirm the place of memebr be deleted
    const i = ids.indexOf(member.id);

    if (this.multiple) {
      this.items = [...this.items.slice(0, i), ...this.items.slice(i + 1)];

    } else {
      this.items = [];
    }
    this.chipsForm.patchValue({memberSearch: ''});
    this.propagateChange(this.items);
  }

  // add member to maintain members array
  handleMemberSelection(member: User) {

    // if this member, who will be added, is contained in the memebers, we do nothing
    if (this.items.map(item => item.id).indexOf(member.id) !== -1) {
      return;
    }
    // if can put in multiple users, I put the added member to the members array, otherwise, just leave one member.
    this.items = this.multiple ? [...this.items, member] : [member];

    // update the form 
    this.chipsForm.patchValue({memberSearch: member.name});
    this.propagateChange(this.items);
  }

  // used for the input display when select option
  displayUser(user: User): string {
    return user ? user.name : '';
  }

  // whether show the input 
  get displayInput() {
    return this.multiple || this.items.length === 0;
  }

  searchUsers(obs: Observable<string>): Observable<User[]> {
    return obs.startWith('')
      .debounceTime(300)
      .distinctUntilChanged()
      .filter(s => s && s.length > 1)
      .switchMap(str => this.service.searchUsers(str));
  }

}
