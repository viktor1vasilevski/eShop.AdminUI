import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { NotificationType } from '../enums/notification-type.enum'; // adjust path

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private _notificationService: NotificationService) {}

  handleErrors(errorResponse: any) {
    if (errorResponse?.error?.errors) {
      const errors = errorResponse.error.errors;
      for (const field in errors) {
        if (errors.hasOwnProperty(field)) {
          errors[field].forEach((message: string) => {
            this._notificationService.notify(
              NotificationType.ServerError,
              `${field}: ${message}`,
              {
                timeOut: 4500,
                positionClass: 'toast-bottom-right',
              }
            );
          });
        }
      }
    } else if (errorResponse?.error?.message) {
      this._notificationService.notify(
        NotificationType.ServerError,
        errorResponse.error.message
      );
    } else {
      this._notificationService.notify(
        NotificationType.ServerError,
        'An unexpected error occurred.'
      );
    }
  }
}
