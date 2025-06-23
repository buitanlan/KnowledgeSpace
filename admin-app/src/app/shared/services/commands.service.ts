import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Command } from '../models/Command';

@Injectable({
  providedIn: 'root'
})
export class CommandsService {

  readonly http = inject(HttpClient);

  getAll() {
    return this.http.get<Command[]>(`${environment.apiUrl}/api/commands`);
  }
}
