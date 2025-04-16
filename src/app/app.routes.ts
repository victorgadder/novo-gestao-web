import { Routes } from '@angular/router';
import { authGuard } from './shared/guard/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'students',
        loadComponent: () =>
          import('./pages/students/students.component').then((m) => m.StudentsComponent),
        children: [
          {
            path: 'list',
            loadComponent: () =>
              import('./pages/students/list-student/list-student.component').then((m) => m.ListStudentComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./pages/students/form-student/form-student.component').then((m) => m.FormStudentComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./pages/students/form-student/form-student.component').then((m) => m.FormStudentComponent),
          },
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'articles',
        loadComponent: () =>
          import('./pages/articles/articles.component').then((m) => m.ArticlesComponent),
        children: [
          {
            path: 'list',
            loadComponent: () =>
              import('./pages/articles/list-article/list-article.component').then((m) => m.ListArticleComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./pages/articles/form-article/form-article.component').then((m) => m.FormArticleComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./pages/articles/form-article/form-article.component').then((m) => m.FormArticleComponent),
          },
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users/users.component').then((m) => m.UsersComponent),
        children: [
          {
            path: 'list',
            loadComponent: () =>
              import('./pages/users/list-user/list-user.component').then((m) => m.ListUserComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./pages/users/form-user/form-user.component').then((m) => m.FormUserComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./pages/users/form-user/form-user.component').then((m) => m.FormUserComponent),
          },
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'profile/:id',
        loadComponent: () =>
          import('./pages/users/form-user/form-user.component').then((m) => m.FormUserComponent),
      },
      {
        path: '',
        redirectTo: 'articles',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'article',
    pathMatch: 'full',
  },
];
