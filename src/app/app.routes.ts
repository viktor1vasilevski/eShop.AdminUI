import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import(
        './features/categories/category-list/category-list.component'
      ).then((m) => m.CategoryListComponent),
  },
  {
    path: 'categories/create',
    loadComponent: () =>
      import(
        './features/categories/category-create/category-create.component'
      ).then((m) => m.CategoryCreateComponent),
  },
  {
    path: 'categories/edit',
    loadComponent: () =>
      import(
        './features/categories/category-edit/category-edit.component'
      ).then((m) => m.CategoryEditComponent),
  },
  {
    path: 'subcategories',
    loadComponent: () =>
      import(
        './features/subcategories/subcategories/subcategories.component'
      ).then((m) => m.SubcategoriesComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/product-list/product-list.component').then(
        (m) => m.ProductListComponent
      ),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./features/orders/order-list/order-list.component').then(
        (m) => m.OrderListComponent
      ),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./features/users/user-list/user-list.component').then(
        (m) => m.UserListComponent
      ),
  },
];
