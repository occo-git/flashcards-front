import { Component, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,  
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [],
  templateUrl: './logout.html',
  styleUrl: './logout.scss'
})
export class LogoutComponent {
    credentials = { username: '', password: '' };

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    onSubmit() {
        if (this.authService.login(this.credentials)) {
            // Get the returnUrl from query params or default to a route like 'quiz'
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/quiz';
            this.router.navigate([returnUrl]);
        } else {
            // Handle login failure (e.g., show error message)
            alert('Invalid credentials');
        }
    }
}
