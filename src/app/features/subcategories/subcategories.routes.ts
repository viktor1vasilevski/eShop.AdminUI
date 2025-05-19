import { Routes } from '@angular/router';

export const subcategoryRoutes: Routes = [
  {
    path: 'subcategories',
    loadComponent: () =>
      import('./subcategory-list/subcategory-list.component').then(
        (m) => m.SubcategoryListComponent
      ),
  },
  {
    path: 'subcategories/create',
    loadComponent: () =>
      import('./subcategory-create/subcategory-create.component').then(
        (m) => m.SubcategoryCreateComponent
      ),
  },
  {
    path: 'subcategories/edit/:id',
    loadComponent: () =>
      import('./subcategory-edit/subcategory-edit.component').then(
        (m) => m.SubcategoryEditComponent
      ),
  },
];
