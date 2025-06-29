import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { OidcSecurityService, AuthenticatedResult } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authNavStatusSource = new BehaviorSubject(false);
  authNavStatus$ = this.authNavStatusSource.asObservable();
  private oidcSecurityService = inject(OidcSecurityService);

  constructor() {
    // Subscribe to auth status changes
    this.oidcSecurityService.isAuthenticated$
      .pipe(
        map(result => result.isAuthenticated)
      )
      .subscribe(isAuthenticated => {
        this.authNavStatusSource.next(isAuthenticated);
      });

    // Debug: Log all events
    this.oidcSecurityService.checkAuth().subscribe({
      next: (result) => console.log('CheckAuth result:', result),
      error: (error) => console.error('CheckAuth error:', error)
    });
  }

  login(redirectUrl?: string) {
    console.log('Login initiated with redirect:', redirectUrl);
    
    // Save redirect URL for after authentication
    if (redirectUrl) {
      sessionStorage.setItem('redirect_url', redirectUrl);
    }
    
    // Use authorize method from OidcSecurityService
    this.oidcSecurityService.authorize();
  }

  // Synchronous method for guards
  isAuthenticated(): boolean {
    return this.authNavStatusSource.value;
  }

  // Reactive method for components
  isAuthenticated$(): Observable<boolean> {
    return this.oidcSecurityService.isAuthenticated$.pipe(
      map(result => result.isAuthenticated)
    );
  }

  // For backward compatibility with existing components
  get authorizationHeaderValue(): string | null {
    // Note: This is synchronous and might return null if token is not immediately available
    let token: string | null = null;
    this.oidcSecurityService.getAccessToken()
      .pipe(take(1))
      .subscribe(accessToken => {
        token = accessToken ? `Bearer ${accessToken}` : null;
      });
    return token;
  }

  get name(): string {
    let userName = '';
    this.oidcSecurityService.getUserData()
      .pipe(take(1))
      .subscribe(userData => {
        if (userData) {
          userName = userData.name || userData.preferred_username || userData.given_name || '';
        }
      });
    return userName;
  }

  getProfile() {
    let profile: any = null;
    this.oidcSecurityService.getUserData()
      .pipe(take(1))
      .subscribe(userData => {
        profile = userData;
      });
    return profile;
  }

  // Observable versions (recommended for new code)
  getAccessToken(): Observable<string> {
    return this.oidcSecurityService.getAccessToken();
  }

  getUserData(): Observable<any> {
    return this.oidcSecurityService.getUserData();
  }

  async signOut() {
    sessionStorage.removeItem('redirect_url');
    this.oidcSecurityService.logoff().subscribe({
      next: (result) => console.log('Logout result:', result),
      error: (error) => console.error('Logout error:', error)
    });
  }

}
