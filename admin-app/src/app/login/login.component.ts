import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { AuthService } from '../shared/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    constructor(private readonly authService: AuthService, private readonly spinner: NgxSpinnerService) {}

    ngOnInit() {
        this.login();
    }

    login() {
        this.spinner.show();
        this.authService.login();
    }
}
