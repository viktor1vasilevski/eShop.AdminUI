import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { inject } from '@angular/core';
import { AuthenticationManagerService } from "../services/authentication-manager.service";


export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authenticationManagerService = inject(AuthenticationManagerService);
  const router = inject(Router);
  //const toastr = inject(ToastrService);

  debugger

  const isLoggedIn = authenticationManagerService.isLoggedIn();
  
  if (isLoggedIn) {

  }

  if (route.url[0].path === 'login' || route.url[0].path === 'register') {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};