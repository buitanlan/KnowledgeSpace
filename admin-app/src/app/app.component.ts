import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-root',
  template: ` 
    @if (isLoading) {
      <div class="d-flex justify-content-center align-items-center" style="height: 100vh;">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    } @else {
      <router-outlet></router-outlet>
    }
  `,
  imports: [RouterOutlet],
  standalone: true
})
export class AppComponent implements OnInit {
  private oidcSecurityService = inject(OidcSecurityService);
  isLoading = true;

  ngOnInit() {
    this.oidcSecurityService
      .checkAuth()
      .subscribe({
        next: (loginResponse) => {
          console.log('Auth check result:', loginResponse);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Auth check error:', error);
          this.isLoading = false;
        }
      });
  }
}
