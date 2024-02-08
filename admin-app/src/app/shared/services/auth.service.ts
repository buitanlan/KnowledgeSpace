import { Injectable } from '@angular/core';
import { User, UserManager, UserManagerSettings } from 'oidc-client-ts';
import { BehaviorSubject, defer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authNavStatusSource = new BehaviorSubject(false);
  authNavStatus$ = this.authNavStatusSource.asObservable();
  private manager = new UserManager(getClientSettings());
  private user: User | null = null;

  constructor() {
    defer(() => this.manager.getUser()).subscribe((user) => {
      this.user = user;
      this.authNavStatusSource.next(this.isAuthenticated());
    });
  }

  login() {
    return this.manager.signinRedirect();
  }

  async completeAuthentication() {
    this.user = await this.manager.signinRedirectCallback();
    this.authNavStatusSource.next(this.isAuthenticated());
  }

  isAuthenticated(): boolean {
    return !!this.user && !this.user.expired;
  }

  get authorizationHeaderValue(): string | null {
    if (this.user) {
      return `${this.user.token_type} ${this.user.access_token}`;
    }
    return null;
  }

  get name(): string {
    return this.user?.profile.name ?? '';
  }

  getProfile() {
    return this.user?.profile ?? null;
  }

  async signOut() {
    await this.manager.signoutRedirect();
  }
}

export function getClientSettings(): UserManagerSettings {
  return {
    authority: 'https://localhost:5000',
    client_id: 'angular_admin',
    redirect_uri: 'http://localhost:4200/auth-callback',
    post_logout_redirect_uri: 'http://localhost:4200',
    response_type: 'code',
    scope: 'api.knowledgespace openid profile',
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: 'http://localhost:4200/silent-refresh.html'
  };
}
