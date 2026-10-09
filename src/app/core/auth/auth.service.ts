// @security-reviewed SEC-2291 (2026-03-14, AppSec Consumer Apps). Behavior changes need a new review: docs/engineering/frontend-upgrade-policy.md (G3).
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SessionToken, SsoChallenge, User } from '../models';

const STORAGE_KEY = 'dbx.session';

/**
 * Client for the internal Enterprise SSO service (OIDC-style authorize + step-up MFA).
 * Tokens are kept in sessionStorage only; nothing is persisted across browser sessions.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private session$ = new BehaviorSubject<SessionToken | null>(this.restore());
  private challenge?: SsoChallenge;

  readonly user$: Observable<User | null> = this.session$.pipe(map(s => s?.user ?? null));

  constructor(private http: HttpClient, private router: Router) {}

  get token(): string | null {
    const s = this.session$.value;
    return s && s.expiresAt > Date.now() ? s.accessToken : null;
  }

  get isAuthenticated(): boolean {
    return this.token !== null;
  }

  get pendingChallenge(): SsoChallenge | undefined {
    return this.challenge;
  }

  authorize(username: string, password: string): Observable<SsoChallenge> {
    return this.http
      .post<SsoChallenge>(`${environment.ssoUrl}/authorize`, { username, password, clientId: environment.ssoClientId })
      .pipe(tap(c => (this.challenge = c)));
  }

  verifyMfa(code: string): Observable<SessionToken> {
    return this.http
      .post<SessionToken>(`${environment.ssoUrl}/mfa/verify`, { challengeId: this.challenge?.challengeId, code })
      .pipe(
        tap(session => {
          this.challenge = undefined;
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
          this.session$.next(session);
        })
      );
  }

  logout(redirect = true): void {
    sessionStorage.removeItem(STORAGE_KEY);
    this.session$.next(null);
    if (redirect) {
      this.router.navigate(['/login']);
    }
  }

  private restore(): SessionToken | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      const session: SessionToken | null = raw ? JSON.parse(raw) : null;
      return session && session.expiresAt > Date.now() ? session : null;
    } catch {
      return null;
    }
  }
}
