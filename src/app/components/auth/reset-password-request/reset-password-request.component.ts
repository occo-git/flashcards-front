import { Component, ElementRef, ViewChild, ViewEncapsulation, computed, signal } from '@angular/core';
import { NgZone, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '@services/user/user.service';
import { ResetPasswordRequestDto } from '@models/user.dtos';
import { LoaderComponent } from "@app/components/_common-ui/loader/loader.component";
import { SvgIconComponent } from "@components/_common-ui/svg-icon/svg-icon.component";

import { CONST_VALIDATION } from '@validation/validation.constants'
import { CustomValidators } from '@validation/custom-validators';
import { ErrorMessageDirective } from '@validation/error-message/error-message.directive'
import { ErrorMessageComponent } from '@components/_common-ui/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';

import { CONST_ROUTES } from '@routing/routes.constans'
import { SVG_ICON } from '@components/svg-icon.constants';
import { ICONS, AUTH_ITEMS } from '@components/_common-ui/ui.constants';
import { CONST_API_ERRORS, CONST_AUTH } from '@app/services/api.constants';

@Component({
  selector: 'app-reset-password-request',
  standalone: true,
  imports: [ReactiveFormsModule, LoaderComponent, ErrorMessageDirective, ErrorMessageComponent, SvgIconComponent],
  templateUrl: './reset-password-request.html',
  styleUrl: './reset-password-request.scss'
})
export class ResetPasswordRequestComponent {
    form = new FormGroup(
    {
      email: new FormControl(
        CONST_VALIDATION.DEFAULT_VALUE, [
        CustomValidators.required('E-mail is required'),
        CustomValidators.minLength(5, 'E-mail must be at least 5 characters long'),
        CustomValidators.email()
      ])
    });

  readonly ICON = SVG_ICON;
  readonly ICONS = ICONS;
  readonly AUTH_ITEMS = AUTH_ITEMS;
  readonly ROUTES = CONST_ROUTES;

  isResetPasswordRequested = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorResponse = signal<HttpErrorResponse | null>(null);

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  onSubmit() {
    if (this.isLoading()) return;

    this.isLoading.set(true)
    this.errorResponse.set(null);
    this.isResetPasswordRequested.set(false);

    if (this.form.valid) {
      const v = this.form.value;
      if (v) {
        const request: ResetPasswordRequestDto = {
          email: v.email ?? CONST_VALIDATION.DEFAULT_VALUE
        };

        this.userService.resetPasswordRequest(request).subscribe({
          next: response => {
            this.isLoading.set(false);
            this.isResetPasswordRequested.set(response);
          },
          error: err => {
            this.errorResponse.set(err);
            this.isLoading.set(false);
          }
        });
      }
    }
  }

  clearError() {
    this.errorResponse.set(null);
    this.isLoading.set(false);
  }
}