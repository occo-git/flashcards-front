import { Component, ViewEncapsulation, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { UserService } from '@app/services/user/user.service';
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  //encapsulation: ViewEncapsulation.ShadowDom,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatExpansionModule,
    MatListModule,
    //LoaderComponent
],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {

  constructor(
    public userService: UserService
  ) { }

  userLevel = computed(() => this.userService.currentUserInfo()?.level);
}
