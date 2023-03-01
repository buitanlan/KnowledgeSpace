import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { Function } from '../models/function';
import { unflatteringForLeftMenu } from '@app/shared/utils/util';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly http = inject(HttpClient);

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/api/users`);
  }

  getMenuByUser(userId: string) {
    return this.http
      .get<Function[]>(`${environment.apiUrl}/api/users/${userId}/menu`)
      .pipe(map((response) => unflatteringForLeftMenu(response)));
  }
}
