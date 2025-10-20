import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@components/_common-ui/header/header.component';
import { SidebarComponent } from '@components/_common-ui/sidebar/sidebar.component';
import { FooterComponent } from '@components/_common-ui/footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,  
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class LayoutComponent {

}
