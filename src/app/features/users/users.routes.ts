import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: 'users',
    loadComponent: () =>
      import('./user-list/user-list.component').then(
        (m) => m.UserListComponent
      ),
  },
];
