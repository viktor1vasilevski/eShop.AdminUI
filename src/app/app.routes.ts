import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { categoryRoutes } from './features/categories/categories.routes';
import { subcategoryRoutes } from './features/subcategories/subcategories.routes';
import { productRoutes } from './features/products/products.routes';
import { orderRoutes } from './features/orders/orders.routes';
import { userRoutes } from './features/users/users.routes';
import { UnauthorizedComponent } from './features/unauthorized/unauthorized.component';

const protectedRoutes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  ...categoryRoutes,
  ...subcategoryRoutes,
  ...productRoutes,
  ...orderRoutes,
  ...userRoutes,
].map((route) => ({ ...route, canActivate: [authGuard] }));

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  ...protectedRoutes,
];
