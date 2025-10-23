import { Routes } from '@angular/router';
import { LayoutComponent } from './components/_common-ui/layout/layout.component';
import { AuthGuard } from '@guards/auth.guard';
import { RedirectIfAuthenticatedGuard } from '@guards/redirect-if-auth.guard';
import { CONST_ROUTES } from './routing/routes.constans';

// Define the application routes (lazy-loaded where appropriate for performance)
export const routes: Routes = [

    // Default route for unauthenticated users (login or register)
    { path: CONST_ROUTES.ROOT, redirectTo: CONST_ROUTES.AUTH.LOGIN, pathMatch: 'full' },

    // Login and Registration routes (no LayoutComponent)
    {
        path: CONST_ROUTES.AUTH.LOGIN,
        canActivate: [RedirectIfAuthenticatedGuard], // Add guard
        loadComponent: () => import('@components/auth/login/login.component').then(c => c.LoginComponent)
    },
    {
        path: CONST_ROUTES.AUTH.REGISTER,
        canActivate: [RedirectIfAuthenticatedGuard], // Add guard
        loadComponent: () => import('@components/auth/register/register.component').then(c => c.RegisterComponent)
    },
    {
        path: '',
        component: LayoutComponent,
        //canActivate: [AuthGuard],
        children: [

            // Start Activity children
            { path: CONST_ROUTES.ACTIVITY.QUIZ, loadComponent: () => import('@components/activities/quiz/start-quiz.component').then(c => c.StartQuizComponent) },
            //{ path: CONST_ROUTES.ACTIVITY.TYPE_WORD, loadComponent: () => import('@components/activities/type-word/type-word.component').then(c => c.TypeWordComponent) },
            { path: CONST_ROUTES.ACTIVITY.FILL_BLANK, loadComponent: () => import('@components/activities/fill-blank/fill-blank.component').then(c => c.FillBlankComponent) },

            // View Cards children
            { path: CONST_ROUTES.CARDS.CARDS_DECK, loadComponent: () => import('@components/cards/flashcard-deck/flashcard-deck.component').then(c => c.FlashcardDeckComponent) },
            { path: CONST_ROUTES.CARDS.WORDS_LIST, loadComponent: () => import('@components/words/word-list/word-list.component').then(c => c.WordListComponent) },
            //{ path: CONST_ROUTES.CARDS.CHOOSE_THEME'choose-theme', loadComponent: () => import('@components/choose-theme/choose-theme.component').then(c => c.ChooseThemeComponent) },
            //{ path: CONST_ROUTES.CARDS.CHOOSE_DIFFICULTY, loadComponent: () => import('@components/choose-difficulty/choose-difficulty.component').then(c => c.ChooseDifficultyComponent) },

            // Other top-level items
            { path: CONST_ROUTES.USER.PROGRESS, loadComponent: () => import('@components/user/progress/progress.component').then(c => c.ProgressComponent) },
            { path: CONST_ROUTES.USER.CHANGE_LEVEL, loadComponent: () => import('@components/user/change-level/change-level.component').then(c => c.ChangeLevelComponent) }, // Change {lev} level
            { path: CONST_ROUTES.HELP, loadComponent: () => import('@components/user/help/help.component').then(c => c.HelpComponent) },

            // Logout
            { path: CONST_ROUTES.AUTH.LOGOUT, loadComponent: () => import('@components/auth/logout/logout.component').then(c => c.LogoutComponent) },

        ]
    },

    // Wildcard route for a 404 page
    { path: '**', loadComponent: () => import('@components/_common-ui/not-found/not-found.component').then(c => c.NotFoundComponent) }
];