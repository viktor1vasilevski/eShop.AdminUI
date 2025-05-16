import { Routes } from '@angular/router';

export const productRoutes: Routes = [
  {
    path: 'products',
    loadComponent: () =>
      import('./product-list/product-list.component').then(
        (m) => m.ProductListComponent
      ),
  },
];
