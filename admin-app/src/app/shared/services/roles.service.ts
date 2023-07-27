import { environment } from '@environments/environment';
import { inject, Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { Role } from '@app/shared/models/role';
import { HttpClient } from '@angular/common/http';
import { Pagination } from '@app/shared/models/pagination';

@Injectable({ providedIn: 'root' })
export class RolesService {
  readonly http = inject(HttpClient);
  add(entity: Role) {
    return this.http.post(`${environment.apiUrl}/api/roles`, entity);
  }

  update(id: string, entity: Role) {
    return this.http.put(`${environment.apiUrl}/api/roles/${id}`, entity);
  }

  getDetail(id: any) {
    return this.http.get<Role>(`${environment.apiUrl}/api/roles/${id}`);
  }

  getAllPaging(filter: any, pageIndex: any, pageSize: any) {
    return this.http
      .get<Pagination<Role>>(
        `${environment.apiUrl}/api/roles/filter?pageIndex=${pageIndex}&pageSize=${pageSize}&filter=${filter}`
      )
      .pipe(
        map((response: Pagination<Role>) => {
          return response;
        })
      );
  }

  delete(id: any) {
    return this.http.delete(environment.apiUrl + '/api/roles/' + id);
  }
}
