import { Routes } from '@angular/router';

export const categoryRoutes: Routes = [
  {
    path: 'categories',
    loadComponent: () =>
      import('./category-list/category-list.component').then(
        (m) => m.CategoryListComponent
      ),
  },
  {
    path: 'categories/create',
    loadComponent: () =>
      import('./category-create/category-create.component').then(
        (m) => m.CategoryCreateComponent
      ),
  },
  {
    path: 'categories/:id',
    loadComponent: () =>
      import('./category-details/category-details.component').then(
        (m) => m.CategoryDetailsComponent
      ),
  },
  {
    path: 'categories/edit/:id',
    loadComponent: () =>
      import('./category-edit/category-edit.component').then(
        (m) => m.CategoryEditComponent
      ),
  },
];
