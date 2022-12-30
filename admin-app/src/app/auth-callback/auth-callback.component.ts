import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss'],
  imports: [RouterLink, NgIf],
  standalone: true
})
export class AuthCallbackComponent implements OnInit {
  error = false;
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  async ngOnInit() {
    // check for error
    if (this.route.snapshot.queryParams['error']) {
      this.error = true;
      return;
    }

    await this.authService.completeAuthentication();
    void this.router.navigate(['/']);
  }
}
