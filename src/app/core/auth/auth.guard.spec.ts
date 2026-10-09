import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let auth: { isAuthenticated: boolean };

  beforeEach(() => {
    auth = { isAuthenticated: false };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: auth }],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('redirects anonymous users to /login with a returnUrl', () => {
    const result = guard.canActivate({} as any, { url: '/transfers' } as RouterStateSnapshot);
    expect(result instanceof UrlTree).toBeTrue();
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/login?returnUrl=%2Ftransfers');
  });

  it('allows authenticated users', () => {
    auth.isAuthenticated = true;
    expect(guard.canActivate({} as any, { url: '/dashboard' } as RouterStateSnapshot)).toBeTrue();
    expect(guard.canLoad({ path: 'accounts' })).toBeTrue();
  });
});
