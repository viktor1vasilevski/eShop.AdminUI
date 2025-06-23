import { Routes } from '@angular/router';

export const productRoutes: Routes = [
  {
    path: 'products',
    loadComponent: () =>
      import('./product-list/product-list.component').then(
        (m) => m.ProductListComponent
      ),
  },
  {
    path: 'products/create',
    loadComponent: () =>
      import('./product-create/product-create.component').then(
        (m) => m.ProductCreateComponent
      ),
  },
    {
    path: 'products/edit/:id',
    loadComponent: () =>
      import('./product-edit/product-edit.component').then(
        (m) => m.ProductEditComponent
      ),
  },
];
