import { Component, inject, OnInit } from '@angular/core';
import { User } from '@app/shared/models/user';
import { Observable, of } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { AsyncPipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-users',
  template: `
    <p>users list!</p>
    <ul>
      <li *ngFor="let user of users$ | async">{{ user.userName }}</li>
    </ul>
  `,
  imports: [NgForOf, AsyncPipe],
  standalone: true
})
export class UsersComponent implements OnInit {
  public users$: Observable<User[]> = of([]);
  userService = inject(UserService);

  ngOnInit() {
    this.users$ = this.userService.getAll();
  }
}
