import { Component, inject, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { AuthService } from '../shared/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  template: `
    <div [@routerTransition]="" class="login-page">
      <div class="row justify-content-md-center">
        <div class="col-md-4">
          <img class="user-avatar" src="assets/images/logo.png" width="150px" alt="" />
          <h1>Knowledge Space Administration</h1>
          <form role="form">
            <a class="btn rounded-btn" (click)="login()">{{ 'Log in' }}</a>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss'],
  animations: [routerTransition()],
  standalone: true
})
export class LoginComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly spinner = inject(NgxSpinnerService);

  ngOnInit() {
    this.login();
  }

  login() {
    void this.spinner.show();
    void this.authService.login();
  }
}
