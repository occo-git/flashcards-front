import { Routes } from '@angular/router';
import { LayoutComponent } from '@components/_common-ui/layout/layout.component';
import { AuthGuard } from '@guards/auth.guard';
import { RedirectIfAuthenticatedGuard } from '@guards/redirect-if-auth.guard';
import { CONST_ROUTES } from '@routing/routes.constans';

// Define the application routes (lazy-loaded where appropriate for performance)
export const routes: Routes = [

    // Default route for unauthenticated users (login or register)
    { path: CONST_ROUTES.ROOT, redirectTo: CONST_ROUTES.AUTH.LOGIN, pathMatch: 'full' },

    // Login and Registration routes, redirect to default page if already authenticated
    {
        path: CONST_ROUTES.AUTH.LOGIN,
        canActivate: [RedirectIfAuthenticatedGuard],
        loadComponent: () => import('@components/auth/login/login.component').then(c => c.LoginComponent)
    },
    {
        path: CONST_ROUTES.AUTH.REGISTER,
        canActivate: [RedirectIfAuthenticatedGuard],
        loadComponent: () => import('@components/auth/register/register.component').then(c => c.RegisterComponent)
    },
    {
        path: CONST_ROUTES.EMAIL.RESEND_EMAIL_CONFIRMATION,
        canActivate: [RedirectIfAuthenticatedGuard],
        loadComponent: () => import('@components/auth/resend-email-confirmation/resend-email-confirmation.component').then(c => c.RsendendEmailConfirmationComponent)
    },
    {
        path: CONST_ROUTES.EMAIL.CONFIRM_EMAIL,
        canActivate: [RedirectIfAuthenticatedGuard],
        loadComponent: () => import('@components/auth/confirm-email/confirm-email.component').then(c => c.ConfirmEmailComponent)
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [

            // Start Activity children
            { path: CONST_ROUTES.ACTIVITY.QUIZ, loadComponent: () => import('@components/activities/quiz/start-quiz.component').then(c => c.StartQuizComponent) },
            { path: CONST_ROUTES.ACTIVITY.TYPE_WORD, loadComponent: () => import('@components/activities/type-word/type-word.component').then(c => c.TypeWordComponent) },
            { path: CONST_ROUTES.ACTIVITY.FILL_BLANK, loadComponent: () => import('@components/activities/fill-blank/fill-blank.component').then(c => c.FillBlankComponent) },

            // View Cards children
            { path: CONST_ROUTES.CARDS.CARDS_DECK, loadComponent: () => import('@components/cards/flashcard-from-deck/flashcard-from-deck.component').then(c => c.FlashcardFromDeckComponent) },
            { path: CONST_ROUTES.CARDS.WORDS_LIST, loadComponent: () => import('@components/words/word-list/word-list.component').then(c => c.WordListComponent) },
            //{ path: CONST_ROUTES.CARDS.CHOOSE_THEME'choose-theme', loadComponent: () => import('@components/choose-theme/choose-theme.component').then(c => c.ChooseThemeComponent) },
            //{ path: CONST_ROUTES.CARDS.CHOOSE_DIFFICULTY, loadComponent: () => import('@components/choose-difficulty/choose-difficulty.component').then(c => c.ChooseDifficultyComponent) },

            // Other top-level items
            { path: CONST_ROUTES.USER.PROGRESS, loadComponent: () => import('@components/user/progress/progress.component').then(c => c.ProgressComponent) },
            { path: CONST_ROUTES.USER.CHANGE_LEVEL, loadComponent: () => import('@components/user/change-level/change-level.component').then(c => c.ChangeLevelComponent) }, // Change {lev} level
            { path: CONST_ROUTES.HELP, loadComponent: () => import('@components/user/help/help.component').then(c => c.HelpComponent) },

            // Profile
            { path: CONST_ROUTES.USER.PROFILE, loadComponent: () => import('@components/user/profile/profile.component').then(c => c.ProfileComponent) },
            { path: CONST_ROUTES.AUTH.LOGOUT, loadComponent: () => import('@components/auth/logout/logout.component').then(c => c.LogoutComponent) },

        ]
    },

    // Wildcard route for a 404 page
    { path: '**', loadComponent: () => import('@components/_common-ui/not-found/not-found.component').then(c => c.NotFoundComponent) }
];