import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FunctionService {
  constructor(private readonly http: HttpClient) {}
}
