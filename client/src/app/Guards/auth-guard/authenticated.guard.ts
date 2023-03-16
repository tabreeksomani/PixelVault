import {CanActivateFn, Router} from '@angular/router';
import {UserService} from "../../Services/user.service";
import {inject} from "@angular/core";

export const AuthenticatedGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (!userService.isLoggedIn()) {
    return router.navigate(['/login']);

  } else return true;
}
