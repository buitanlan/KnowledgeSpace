import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-auth-callback',
  template: `
    @if (error) {
      <div class="container mt-5">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="alert alert-danger" role="alert">
              <h4 class="alert-heading">Authentication Error</h4>
              <p>{{ errorMessage }}</p>
              <hr>
              <p class="mb-0">
                <a routerLink="/login" class="btn btn-primary">Try Again</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="container mt-5">
        <div class="row justify-content-center">
          <div class="col-md-6 text-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Processing authentication...</span>
            </div>
            <p class="mt-3">Processing authentication...</p>
            <p><small>{{ debugMessage }}</small></p>
          </div>
        </div>
      </div>
    }
  `,
  imports: [RouterLink],
  standalone: true
})
export class AuthCallbackComponent implements OnInit {
  error = false;
  errorMessage = '';
  debugMessage = 'Initializing...';
  private oidcSecurityService = inject(OidcSecurityService);
  private router = inject(Router);

  ngOnInit() {
    this.debugMessage = 'Checking authentication...';
    
    this.oidcSecurityService
      .checkAuth()
      .subscribe({
        next: (loginResponse) => {
          console.log('Auth callback - Login response:', loginResponse);
          this.debugMessage = `Auth status: ${loginResponse.isAuthenticated}`;
          
          if (loginResponse.errorMessage) {
            console.error('Auth callback - Error:', loginResponse.errorMessage);
            this.error = true;
            this.errorMessage = loginResponse.errorMessage;
            return;
          }

          if (loginResponse.isAuthenticated) {
            // Get the redirect URL from session storage
            const redirectUrl = sessionStorage.getItem('redirect_url') || '/dashboard';
            sessionStorage.removeItem('redirect_url');
            
            console.log('Auth callback - Redirecting to:', redirectUrl);
            this.debugMessage = `Redirecting to: ${redirectUrl}`;
            
            // Use setTimeout to ensure the auth state is properly set
            setTimeout(() => {
              this.router.navigate([redirectUrl], { replaceUrl: true });
            }, 100);
          } else {
            console.log('Auth callback - Not authenticated, redirecting to login');
            this.error = true;
            this.errorMessage = 'Authentication was not successful. Please try again.';
          }
        },
        error: (error) => {
          console.error('Auth callback - Error:', error);
          this.error = true;
          this.errorMessage = 'An unexpected error occurred during authentication.';
        }
      });
  }
}
