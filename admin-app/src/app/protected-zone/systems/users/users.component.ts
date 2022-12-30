import { Component, OnInit } from '@angular/core';
import { User } from '@app/shared/models/user';
import { Observable, of } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { AsyncPipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  imports: [NgForOf, AsyncPipe],
  standalone: true
})
export class UsersComponent implements OnInit {
  public users$: Observable<User[]> = of([]);
  constructor(private readonly userService: UserService) {}

  ngOnInit() {
    this.users$ = this.userService.getAll();
  }
}
