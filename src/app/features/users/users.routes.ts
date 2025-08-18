import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: 'users',
    loadComponent: () =>
      import('./user-list/user-list.component').then(
        (m) => m.UserListComponent
      ),
  },
  {
    path: 'users/:id/orders',
    loadComponent: () =>
      import('./user-orders/user-orders.component').then(
        (m) => m.UserOrdersComponent
      ),
  },
];
