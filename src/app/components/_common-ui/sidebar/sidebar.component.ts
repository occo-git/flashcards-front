import { Component, ViewEncapsulation, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { UserService } from '@services/user/user.service';
import { SvgIconComponent } from '@components/_common-ui/svg-icon/svg-icon.component';
import { LoaderComponent } from "../loader/loader.component";
import { SVG_ICON } from "@components/svg-icon.constants"

@Component({
  selector: 'app-sidebar',
  standalone: true,
  //encapsulation: ViewEncapsulation.ShadowDom,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatExpansionModule,
    MatListModule,
    SvgIconComponent
    //LoaderComponent
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {

  readonly ICON = SVG_ICON;

  constructor(
    public userService: UserService
  ) { }

  userLevel = computed(() => this.userService.currentUserInfo() ? this.userService.currentUserInfo()!.level : '___');
}
