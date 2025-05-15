import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationManagerService } from '../services/authentication-manager.service';

export const authGuard: CanActivateFn = () => {
  const authenticationManagerService = inject(AuthenticationManagerService);
  const router = inject(Router);

  const isLoggedIn = authenticationManagerService.isLoggedIn();

  if (isLoggedIn) {
    return true;
  } else {
    router.navigate(['/unauthorized']);
    return false;
  }
};
