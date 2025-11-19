import { Component, signal, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '@services/user/user.service';
import { ConfirmEmailRequestDto, ConfirmEmailResponseDto } from '@models/email.dtos';
import { LoaderComponent } from "@components/_common-ui/loader/loader.component";
import { SvgIconComponent } from "@components/_common-ui/svg-icon/svg-icon.component";

import { CONST_API_ERRORS } from '@services/api.constants';
import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';

import { CONST_ROUTES } from '@routing/routes.constans';
import { SVG_ICON } from '@components/svg-icon.constants';
import { ICONS, EMAIL_ITEMS } from '@components/_common-ui/ui.constants';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [ErrorMessageComponent, SvgIconComponent, LoaderComponent],
  templateUrl: './confirm-email.html',
  styleUrl: './confirm-email.scss'
})
export class ConfirmEmailComponent {

  readonly ICON = SVG_ICON;
  readonly ICONS = ICONS;
  readonly EMAIL_ITEMS = EMAIL_ITEMS;
  readonly ROUTES = CONST_ROUTES;

  token: string = '';
  result = signal<ConfirmEmailResponseDto | null>(null);
  showReconfirm = signal<boolean>(false);

  isLoading = signal<boolean>(false);
  errorResponse = signal<HttpErrorResponse | null>(null);

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      const token = params['token'];
      this.token = token;
      this.confirmEmail();
    });
  }

  private confirmEmail() {
    if (this.isLoading()) return;
    this.showReconfirm.set(false);
    this.errorResponse.set(null);
    this.isLoading.set(true);

    const request: ConfirmEmailRequestDto = { token: this.token };

    this.userService.confirmEmail(request).subscribe({
      next: response => {
        this.result.set(response);
        this.isLoading.set(false);
      },
      error: err => {
        this.showReconfirm.set(true);
        this.errorResponse.set(err);
        this.isLoading.set(false);
      }
    });
  }

  clearError() {
    this.errorResponse.set(null);
    this.isLoading.set(true);
  }
}