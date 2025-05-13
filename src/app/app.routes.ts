import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [ authGuard ] },
    { path: '', redirectTo: '/login', pathMatch: 'full' },

    { path: 'dashboard', 
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
    },
];
