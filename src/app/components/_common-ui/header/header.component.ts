import { Component } from '@angular/core';
import { SoundToggleComponent } from '../toggle/sound-toggle/sound-toggle.component';
import { ThemeToggleComponent } from "../toggle/theme-toggle/theme-toggle.component";

@Component({
  selector: 'app-header',
  imports: [SoundToggleComponent, ThemeToggleComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {

}
