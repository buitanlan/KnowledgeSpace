import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { Function } from '../models/function';
import { unflatteringForLeftMenu } from '@app/shared/utils/util';
import { Pagination } from '@app/shared/models/pagination';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  readonly http = inject(HttpClient);

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/api/users`);
  }

  add(entity: User) {
    return this.http.post(`${environment.apiUrl}/api/users`, entity);
  }

  update(id: string, entity: User) {
    return this.http.put(`${environment.apiUrl}/api/users/${id}`, entity);
  }

  getDetail(id: string) {
    return this.http.get<User>(`${environment.apiUrl}/api/users/${id}`);
  }

  getAllPaging(filter: string, pageIndex: number, pageSize: number) {
    return this.http.get<Pagination<User>>(
      `${environment.apiUrl}/api/users/filter?pageIndex=${pageIndex}&pageSize=${pageSize}&filter=${filter}`
    );
  }

  getMenuByUser(userId: string) {
    return this.http
      .get<Function[]>(`${environment.apiUrl}/api/users/${userId}/menu`)
      .pipe(map((response) => unflatteringForLeftMenu(response)));
  }

  delete(id: string) {
    return this.http.delete(environment.apiUrl + '/api/users/' + id);
  }

  getUserRoles(userId: string) {
    return this.http.get<string[]>(`${environment.apiUrl}/api/users/${userId}/roles`);
  }

  removeRolesFromUser(id: string, roleNames: string[]) {
    let rolesQuery = '';
    for (const roleName of roleNames) {
      rolesQuery += 'roleNames' + '=' + roleName + '&';
    }
    return this.http.delete(environment.apiUrl + '/api/users/' + id + '/roles?' + rolesQuery);
  }

  assignRolesToUser(userId: string, assignRolesToUser: any) {
    return this.http.post(`${environment.apiUrl}/api/users/${userId}/roles`, assignRolesToUser);
  }
}
