import { Component, computed, signal, ViewEncapsulation } from '@angular/core';

import { SvgIconComponent } from "@components/_common-ui/svg-icon/svg-icon.component";
import { SVG_ICON } from '@components/svg-icon.constants';

import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '@app/services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CONST_ROUTES } from '@app/routing/routes.constans';
import { LoaderComponent } from "@app/components/_common-ui/loader/loader.component";
import { EMAIL_ITEMS, ICONS } from '@app/components/_common-ui/ui.constants';
import { ConfirmEmailRequestDto, ConfirmEmailResponseDto } from '@app/models/email.dtos';

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
  isSuccess = computed(() => this.result()?.success);

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
    this.errorResponse.set(null);
    this.isLoading.set(true);

    const request: ConfirmEmailRequestDto = { token: this.token };

    this.userService.confirmEmail(request).subscribe({
      next: response => {
        this.result.set(response);
        this.isLoading.set(false);
      },
      error: err => {
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