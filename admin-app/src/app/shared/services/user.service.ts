import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../models/user";
import { environment } from "src/environments/environment";
import { UtilitiesService } from "@app/shared/services/utilities.service";
import { map } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private readonly http: HttpClient,
                private readonly utilitiesService: UtilitiesService) {}

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/api/users`);
    }

    getMenuByUser(userId: string) {
        return this.http.get<Function[]>(`${environment.apiUrl}/api/users/${userId}/menu`).pipe(
            map(response => this.utilitiesService.unflatteringForLeftMenu(response)));
    }


}
