import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'generator-quiz',
        loadComponent: () => import('./pages/generator-quiz-page/generator-quiz-page')
            .then(x => x.default),
    },
    {
        path: '**',
        redirectTo: '/generator-quiz'
    }
];
