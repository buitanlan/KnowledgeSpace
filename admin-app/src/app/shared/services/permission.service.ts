import { inject, Injectable } from '@angular/core';
import { PermissionUpdateRequest } from '@app/shared/models/permission-update-request';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { PermissionScreen } from '@app/shared/models/permission-screen';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  http = inject(HttpClient);

  save(roleId: string, request: PermissionUpdateRequest) {
    return this.http.put(`${environment.apiUrl}/api/roles/${roleId}/permissions`, request)
  }

  getFunctionWithCommands() {
    return this.http.get<PermissionScreen>(`${environment.apiUrl}/api/permissions`);
  }
}
