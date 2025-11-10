import { Component } from '@angular/core';
import { ThemeToggleComponent } from "../theme/theme-toggle.component";

@Component({
  selector: 'app-header',
  imports: [ThemeToggleComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {

}
