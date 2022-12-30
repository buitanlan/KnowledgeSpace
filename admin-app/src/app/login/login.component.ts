import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { AuthService } from '../shared/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [routerTransition()],
  imports: [TranslateModule],
  standalone: true
})
export class LoginComponent implements OnInit {
  constructor(private readonly authService: AuthService, private readonly spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.login();
  }

  login() {
    void this.spinner.show();
    void this.authService.login();
  }
}
