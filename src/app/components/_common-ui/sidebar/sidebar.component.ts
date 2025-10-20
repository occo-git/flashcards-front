import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  //encapsulation: ViewEncapsulation.ShadowDom,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatExpansionModule,
    MatListModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {
  currentLevel: string = 'A1'; // Default level

}
