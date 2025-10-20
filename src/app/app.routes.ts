import { Routes } from '@angular/router';
import { LayoutComponent } from './components/_common-ui/layout/layout.component';
import { AuthGuard } from '@guards/auth.guard';
import { RedirectIfAuthenticatedGuard } from '@guards/redirect-if-auth.guard';

// Define the application routes (lazy-loaded where appropriate for performance)
export const routes: Routes = [

    // Default route for unauthenticated users (login or register)
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // Login and Registration routes (no LayoutComponent)
    {
        path: 'login',
        canActivate: [RedirectIfAuthenticatedGuard], // Add guard
        loadComponent: () => import('./components/auth/login/login.component').then(c => c.LoginComponent)
    },
    {
        path: 'register',
        canActivate: [RedirectIfAuthenticatedGuard], // Add guard
        loadComponent: () => import('./components/auth/register/register.component').then(c => c.RegisterComponent)
    },
    {
        path: '',
        component: LayoutComponent,
        //canActivate: [AuthGuard],
        children: [

            // Start Activity children
            { path: 'quiz', loadComponent: () => import('./components/activities/quiz/start-quiz.component').then(c => c.StartQuizComponent) },
            //{ path: 'type-word', loadComponent: () => import('./components/activities/type-word/type-word.component').then(c => c.TypeWordComponent) },
            { path: 'fill-blank', loadComponent: () => import('./components/activities/fill-blank/fill-blank.component').then(c => c.FillBlankComponent) },

            // View Cards children
            { path: 'cards-deck', loadComponent: () => import('./components/cards/flashcard-deck/flashcard-deck.component').then(c => c.FlashcardDeckComponent) },
            { path: 'words-list', loadComponent: () => import('./components/words/word-list/word-list.component').then(c => c.WordListComponent) },
            //{ path: 'choose-theme', loadComponent: () => import('./components/choose-theme/choose-theme.component').then(c => c.ChooseThemeComponent) },
            //{ path: 'choose-difficulty', loadComponent: () => import('./components/choose-difficulty/choose-difficulty.component').then(c => c.ChooseDifficultyComponent) },

            // Other top-level items
            { path: 'progress', loadComponent: () => import('./components/user/progress/progress.component').then(c => c.ProgressComponent) },
            { path: 'change-level', loadComponent: () => import('./components/user/change-level/change-level.component').then(c => c.ChangeLevelComponent) }, // Change {lev} level
            { path: 'help', loadComponent: () => import('./components/user/help/help.component').then(c => c.HelpComponent) },

            // Logout
            { path: 'logout', loadComponent: () => import('./components/auth/logout/logout.component').then(c => c.LogoutComponent) },

        ]
    },

    // Wildcard route for a 404 page
    { path: '**', loadComponent: () => import('./components/_common-ui/not-found/not-found.component').then(c => c.NotFoundComponent) }
];