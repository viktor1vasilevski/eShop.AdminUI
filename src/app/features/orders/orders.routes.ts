import { Routes } from '@angular/router';

export const orderRoutes: Routes = [
  {
    path: 'orders',
    loadComponent: () =>
      import('./order-list/order-list.component').then(
        (m) => m.OrderListComponent
      ),
  },
];
