import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { categoryRoutes } from './features/categories/categories.routes';
import { subcategoryRoutes } from './features/subcategories/subcategories.routes';
import { productRoutes } from './features/products/products.routes';
import { orderRoutes } from './features/orders/orders.routes';
import { userRoutes } from './features/users/users.routes';

const protectedRoutes = [
  ...categoryRoutes,
  ...subcategoryRoutes,
  ...productRoutes,
  ...orderRoutes,
  ...userRoutes,
].map((route) => ({ ...route, canActivate: [authGuard] }));

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
      canActivate: [authGuard]
  },
  ...protectedRoutes,
];
