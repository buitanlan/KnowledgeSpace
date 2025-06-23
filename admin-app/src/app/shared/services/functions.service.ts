import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CommandAssign } from '../models/CommandAssign';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class FunctionsService {
  readonly http = inject(HttpClient);

  add(entity: Function) {
    return this.http.post(`${environment.apiUrl}/api/functions`, entity);
  }

  update(id: string, entity: Function) {
    return this.http.put(`${environment.apiUrl}/api/functions/${id}`, entity);
  }

  getDetail(id: string) {
    return this.http.get<Function>(`${environment.apiUrl}/api/functions/${id}`);
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/api/functions/${id}`);
  }

  getAll() {
    return this.http.get<Function[]>(`${environment.apiUrl}/api/functions`);
  }

  getAllByParentId(parentId?: string) {
    const url = parentId 
      ? `${environment.apiUrl}/api/functions/${parentId}/parents`
      : `${environment.apiUrl}/api/functions/`;
    
    return this.http.get<Function[]>(url);
  }

  getAllCommandsByFunctionId(functionId: string) {
    return this.http.get<Function[]>(`${environment.apiUrl}/api/functions/${functionId}/commands`);
  }

  addCommandsToFunction(functionId: string, commandAssign: CommandAssign) {
    return this.http.post(`${environment.apiUrl}/api/functions/${functionId}/commands/`, commandAssign);
  }

  deleteCommandsFromFunction(functionId: string, commandAssign: CommandAssign) {
    let query = '';
    for (const commandId of commandAssign.commandIds) {
      query += 'commandIds' + '=' + commandId + '&';
    }
    return this.http.delete(`${environment.apiUrl}/api/functions/${functionId}/commands?${query}addToAllFunction=${commandAssign.addToAllFunctions}`);
  }
}